import { useEffect, useRef } from "react";

const VideoCall = () => {

  const localVideoRef = useRef(null);

  useEffect(() => {
    startVideo();
  }, []);

  const startVideo = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;

    } catch (error) {
      console.log("Media access error:", error);
    }

  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="w-[500px] rounded-xl"
      />

    </div>
  );
};

export default VideoCall;