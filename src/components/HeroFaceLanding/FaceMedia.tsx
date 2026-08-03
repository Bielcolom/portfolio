"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./FaceMedia.module.scss";

interface Props {
  src: string;
}

const FaceMedia = ({ src }: Props) => {
  const isVideo = !!src && src.toLowerCase().endsWith(".mp4");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = failedSrc === src;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => { /* autoplay may be blocked */ });
  }, [src]);

  if (hasError) {
    return <div className={styles.fallback} />;
  }

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        onError={() => setFailedSrc(src)}
        className={styles.video}
      />
    );
  }

  return (
    <span className={styles.imageWrapper}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 90vw, 320px"
        onError={() => setFailedSrc(src)}
        style={{ objectFit: "cover" }}
      />
    </span>
  );
};

export default FaceMedia;
