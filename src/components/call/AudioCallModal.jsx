import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ICE = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] };

const AudioCallModal = ({ phase, contact, incomingMeta, socket, currentUser, onClose }) => {
  const [livePhase, setLivePhase] = useState(phase); // outgoing | incoming | connecting | active
  const [isMuted, setIsMuted]   = useState(false);
  const [duration, setDuration] = useState(0);
  const [peerSocketId, setPeerSocketId] = useState(incomingMeta?.callerSocketId || null);

  const pcRef          = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const iceQueue       = useRef([]);
  const audioCtxRef    = useRef(null);
  const ringRef        = useRef(null);
  const durationRef    = useRef(null);
  const timeoutRef     = useRef(null);

  // ── Ringtone ──────────────────────────────────────────────────────────────
  const startRing = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const play = () => {
        [480, 620].forEach((freq, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.5);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.5 + 0.4);
          o.start(ctx.currentTime + i * 0.5);
          o.stop(ctx.currentTime + i * 0.5 + 0.4);
        });
      };
      play();
      ringRef.current = setInterval(play, 2500);
    } catch (_) {}
  }, []);

  const stopRing = useCallback(() => {
    clearInterval(ringRef.current);
    try { audioCtxRef.current?.close(); audioCtxRef.current = null; } catch (_) {}
  }, []);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    stopRing();
    clearInterval(durationRef.current);
    clearTimeout(timeoutRef.current);
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
  }, [stopRing]);

  // ── PeerConnection factory ─────────────────────────────────────────────────
  const buildPC = useCallback((remoteId) => {
    const pc = new RTCPeerConnection(ICE);
    pcRef.current = pc;
    pc.onicecandidate = e => {
      if (e.candidate) socket.emit('audio-ice-candidate', { peerSocketId: remoteId, candidate: e.candidate });
    };
    pc.ontrack = e => {
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = e.streams[0];
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setLivePhase('active');
        durationRef.current = setInterval(() => setDuration(d => d + 1), 1000);
      }
      if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
        handleEnd();
      }
    };
    return pc;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // ── End call ──────────────────────────────────────────────────────────────
  const handleEnd = useCallback(() => {
    if (peerSocketId) socket.emit('call-ended', { peerSocketId });
    cleanup();
    onClose();
  }, [peerSocketId, socket, cleanup, onClose]);

  // ── Decline (incoming) ────────────────────────────────────────────────────
  const handleDecline = useCallback(() => {
    if (incomingMeta?.callerSocketId) socket.emit('call-declined', { callerSocketId: incomingMeta.callerSocketId });
    cleanup();
    onClose();
  }, [incomingMeta, socket, cleanup, onClose]);

  // ── Accept (callee) ───────────────────────────────────────────────────────
  const handleAccept = useCallback(async () => {
    stopRing();
    setLivePhase('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      const pc = buildPC(incomingMeta.callerSocketId);
      setPeerSocketId(incomingMeta.callerSocketId);
      stream.getTracks().forEach(t => pc.addTrack(t, stream));
      socket.emit('call-accepted', {
        callerSocketId: incomingMeta.callerSocketId,
        calleeInfo: { name: currentUser.name, profileImage: currentUser.profileImage },
      });
    } catch (_) {
      toast.error('Microphone access denied');
      handleDecline();
    }
  }, [incomingMeta, socket, currentUser, buildPC, stopRing, handleDecline]);

  // ── Socket events ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // Caller: callee accepted → create offer
    const onCallAccepted = async ({ calleeSocketId }) => {
      stopRing();
      clearTimeout(timeoutRef.current);
      setPeerSocketId(calleeSocketId);
      setLivePhase('connecting');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;
        const pc = buildPC(calleeSocketId);
        stream.getTracks().forEach(t => pc.addTrack(t, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('audio-offer', { peerSocketId: calleeSocketId, offer });
      } catch (_) {
        toast.error('Microphone access denied');
        handleEnd();
      }
    };

    // Callee: receive offer → send answer
    const onAudioOffer = async ({ offer, from }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      // drain ICE queue
      while (iceQueue.current.length) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(iceQueue.current.shift()));
      }
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit('audio-answer', { peerSocketId: from, answer });
    };

    // Caller: receive answer
    const onAudioAnswer = async ({ answer }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      while (iceQueue.current.length) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(iceQueue.current.shift()));
      }
    };

    // Both: ICE candidate
    const onIce = async ({ candidate }) => {
      if (!pcRef.current) return;
      if (pcRef.current.remoteDescription) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        iceQueue.current.push(candidate);
      }
    };

    const onCallEnded    = () => { toast('Call ended', { icon: '📞' }); cleanup(); onClose(); };
    const onCallDeclined = () => { toast('Call declined', { icon: '❌' }); cleanup(); onClose(); };
    const onUserOffline  = () => { toast.error('User is offline or unavailable'); cleanup(); onClose(); };

    socket.on('call-accepted',       onCallAccepted);
    socket.on('audio-offer',         onAudioOffer);
    socket.on('audio-answer',        onAudioAnswer);
    socket.on('audio-ice-candidate', onIce);
    socket.on('call-ended',          onCallEnded);
    socket.on('call-declined',       onCallDeclined);
    socket.on('call-user-offline',   onUserOffline);

    return () => {
      socket.off('call-accepted',       onCallAccepted);
      socket.off('audio-offer',         onAudioOffer);
      socket.off('audio-answer',        onAudioAnswer);
      socket.off('audio-ice-candidate', onIce);
      socket.off('call-ended',          onCallEnded);
      socket.off('call-declined',       onCallDeclined);
      socket.off('call-user-offline',   onUserOffline);
    };
  }, [socket, buildPC, stopRing, handleEnd, cleanup, onClose]);

  // ── On mount: ringtone + auto-timeout ────────────────────────────────────
  useEffect(() => {
    startRing();
    if (phase === 'outgoing') {
      timeoutRef.current = setTimeout(() => {
        toast('No answer', { icon: '📵' });
        cleanup(); onClose();
      }, 45000);
    }
    // Browser notification for incoming
    if (phase === 'incoming' && 'Notification' in window) {
      Notification.requestPermission().then(p => {
        if (p === 'granted')
          new Notification(`📞 Incoming call from ${contact?.name}`, { body: 'Tap to answer' });
      });
    }
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsMuted(m => !m);
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const statusLabel = { outgoing: 'Calling…', incoming: 'Incoming Call', connecting: 'Connecting…', active: fmt(duration) };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative w-full max-w-[320px] bg-gradient-to-b from-slate-800 to-slate-950 rounded-[2.5rem] border border-slate-700/60 shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Pulse rings */}
        {(livePhase === 'outgoing' || livePhase === 'incoming') && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 rounded-full border border-white/10 animate-ping" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-white/5 animate-ping" style={{ animationDelay: '0.4s' }} />
            </div>
          </>
        )}

        <div className="relative px-8 pt-12 pb-10 flex flex-col items-center gap-5">
          {/* Status */}
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${livePhase === 'active' ? 'text-emerald-400' : 'text-slate-400'}`}>
            {statusLabel[livePhase] ?? ''}
          </p>

          {/* Avatar */}
          <div className="relative">
            <div className={`w-28 h-28 rounded-full overflow-hidden border-4 shadow-2xl ${livePhase === 'active' ? 'border-emerald-500/60' : 'border-slate-600'}`}>
              <img
                src={contact?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact?.name || 'User')}&background=2563eb&color=fff&size=200`}
                alt={contact?.name}
                className="w-full h-full object-cover"
              />
            </div>
            {livePhase === 'active' && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            )}
          </div>

          {/* Name */}
          <h2 className="text-xl font-bold text-white tracking-tight">{contact?.name}</h2>

          {/* Buttons */}
          <div className="flex items-end justify-center gap-8 mt-2">
            {/* INCOMING */}
            {livePhase === 'incoming' && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={handleDecline}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all">
                    <PhoneOff className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-[11px] text-slate-400 font-semibold">Decline</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={handleAccept}
                    className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-all animate-bounce">
                    <Phone className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-[11px] text-slate-400 font-semibold">Accept</span>
                </div>
              </>
            )}

            {/* OUTGOING / CONNECTING */}
            {(livePhase === 'outgoing' || livePhase === 'connecting') && (
              <div className="flex flex-col items-center gap-2">
                <button onClick={handleEnd}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all">
                  <PhoneOff className="w-6 h-6 text-white" />
                </button>
                <span className="text-[11px] text-slate-400 font-semibold">Cancel</span>
              </div>
            )}

            {/* ACTIVE */}
            {livePhase === 'active' && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={toggleMute}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isMuted ? 'bg-red-500 shadow-red-500/30' : 'bg-slate-700 hover:bg-slate-600'}`}>
                    {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                  </button>
                  <span className="text-[11px] text-slate-400 font-semibold">{isMuted ? 'Unmute' : 'Mute'}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={handleEnd}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all">
                    <PhoneOff className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-[11px] text-slate-400 font-semibold">End</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hidden remote audio */}
        <audio ref={remoteAudioRef} autoPlay playsInline />
      </div>
    </div>
  );
};

export default AudioCallModal;
