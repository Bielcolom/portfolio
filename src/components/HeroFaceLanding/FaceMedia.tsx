"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./FaceMedia.module.scss";

interface Props {
  src: string;
  /** Bump this to restart the video from the beginning. */
  replayKey?: number;
}

const FaceMedia = ({ src, replayKey }: Props) => {
  const isVideo = !!src && src.toLowerCase().endsWith(".mp4");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const assetKey = `${src}::${replayKey ?? 0}`;
  const [failedAssetKey, setFailedAssetKey] = useState<string | null>(null);
  const hasError = failedAssetKey === assetKey;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => { /* autoplay may be blocked */ });
  }, [replayKey, src]);

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
        onError={() => setFailedAssetKey(assetKey)}
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
        sizes="(max-width: 768px) 94vw, 76vw"
        onError={() => setFailedAssetKey(assetKey)}
        style={{ objectFit: "cover" }}
      />
    </span>
  );
};

export default FaceMedia;
