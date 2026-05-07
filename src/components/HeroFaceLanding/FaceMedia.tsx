"use client";
import { useEffect, useRef } from "react";

interface Props {
  src: string;
  /** Bump this to restart the video from the beginning. */
  replayKey?: number;
}

const FaceMedia = ({ src, replayKey }: Props) => {
  const isVideo = !!src && src.toLowerCase().endsWith(".mp4");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => { /* autoplay may be blocked */ });
  }, [replayKey, src]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }


  return (
    <img
      src={src}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
};

export default FaceMedia;
