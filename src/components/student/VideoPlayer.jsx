import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Monitor, 
  SkipForward, 
  SkipBack,
  ChevronRight,
  Gauge,
  Maximize2,
  Minimize2,
  Tv
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoPlayer = ({ src, onEnded, title, isTheater, onToggleTheater }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [lastAction, setLastAction] = useState(null); // For overlay animations

  const controlsTimeoutRef = useRef(null);

  const togglePlay = useCallback(() => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setLastAction('play');
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setLastAction('pause');
    }
  }, []);

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const skip = (amount) => {
    videoRef.current.currentTime += amount;
    setLastAction(amount > 0 ? 'forward' : 'rewind');
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    videoRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
    if (!newMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
    setShowSpeedMenu(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', onEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 't':
          onToggleTheater();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowright':
          skip(5);
          break;
        case 'arrowleft':
          skip(-5);
          break;
        case 'arrowup':
          e.preventDefault();
          const newVolUp = Math.min(volume + 0.1, 1);
          setVolume(newVolUp);
          videoRef.current.volume = newVolUp;
          break;
        case 'arrowdown':
          e.preventDefault();
          const newVolDown = Math.max(volume - 0.1, 0);
          setVolume(newVolDown);
          videoRef.current.volume = newVolDown;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, onToggleTheater, volume]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => setLastAction(null), 500);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  return (
    <div 
      ref={containerRef}
      className={`relative group bg-black overflow-hidden flex items-center justify-center transition-all duration-500 ease-in-out ${
        isTheater && !isFullscreen ? 'aspect-video w-full' : 'w-full h-full'
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full max-h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Loading State Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-[.is-buffering]:opacity-100 transition-opacity">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>

      {/* Central Action Animation */}
      <AnimatePresence>
        {lastAction && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="absolute z-30 pointer-events-none bg-black/40 backdrop-blur-sm p-8 rounded-full"
          >
            {lastAction === 'play' && <Play size={48} className="text-white fill-white" />}
            {lastAction === 'pause' && <Pause size={48} className="text-white fill-white" />}
            {lastAction === 'forward' && <RotateCw size={48} className="text-white" />}
            {lastAction === 'rewind' && <RotateCcw size={48} className="text-white" />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar - Title (Hidden when controls hide) */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent z-20"
          >
            <h2 className="text-white font-bold text-lg drop-shadow-md">{title}</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 p-6 pt-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 space-y-4"
          >
            {/* Progress Bar */}
            <div className="relative group/progress h-1.5 flex items-center cursor-pointer mb-2">
              <input 
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              />
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              <div 
                className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-xl border-2 border-white"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => skip(-10)} className="text-white hover:text-blue-400 transition-colors">
                    <RotateCcw size={20} />
                  </button>
                  <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                  </button>
                  <button onClick={() => skip(10)} className="text-white hover:text-blue-400 transition-colors">
                    <RotateCw size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-3 group/volume">
                  <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <div className="w-0 group-hover/volume:w-20 transition-all duration-300 overflow-hidden flex items-center">
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-white/30 rounded-full accent-white cursor-pointer"
                    />
                  </div>
                </div>

                <span className="text-white text-xs font-bold tabular-nums">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-6">
                {/* Speed Selector */}
                <div className="relative">
                  <button 
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="flex items-center gap-2 text-white hover:text-blue-400 transition-all text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
                  >
                    <Gauge size={16} />
                    {playbackRate}x
                  </button>
                  <AnimatePresence>
                    {showSpeedMenu && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute bottom-full right-0 mb-4 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[100px]"
                      >
                        {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => handlePlaybackRate(rate)}
                            className={`w-full px-4 py-2 text-left text-xs font-bold transition-all ${
                              playbackRate === rate ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/10'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={onToggleTheater} 
                    className={`text-white hover:text-blue-400 transition-colors ${isTheater ? 'text-blue-500' : ''}`}
                    title="Theater Mode (T)"
                  >
                    <Tv size={20} />
                  </button>
                  <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
