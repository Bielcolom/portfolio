"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./FaceMedia.module.scss";

interface Props {
  src: string;
  /** Still shown until the video paints — also the fallback if it fails. */
  poster?: string;
}

const FaceMedia = ({ src, poster }: Props) => {
  const isVideo = !!src && src.toLowerCase().endsWith(".mp4");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = failedSrc === src;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => { /* autoplay may be blocked */ });
  }, [src]);

  if (isVideo && !hasError) {
    return (
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        onError={() => setFailedSrc(src)}
        className={styles.video}
      />
    );
  }

  const imgSrc = hasError ? poster : src;
  if (!imgSrc) {
    return <div className={styles.fallback} />;
  }

  return (
    <span className={styles.imageWrapper}>
      <Image
        src={imgSrc}
        alt=""
        fill
        sizes="(max-width: 768px) 120px, 320px"
        style={{ objectFit: "cover" }}
      />
    </span>
  );
};

export default FaceMedia;
