"use client";
import { useSyncExternalStore } from "react";
import styles from "./localTime.module.scss";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/* One shared ticking store, so every clock on the page changes on the same frame */
const listeners = new Set<() => void>();
let current = "";
let timer = 0;

const tick = () => {
  current = formatter.format(new Date());
  listeners.forEach((cb) => cb());
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  if (listeners.size === 1) {
    tick();
    timer = window.setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) window.clearInterval(timer);
  };
};

/** The server cannot know the visitor's clock, so it renders a placeholder */
const getServerSnapshot = () => "";
const getSnapshot = () => current;

const LocalTime = ({ label, className }: { label: string; className?: string }) => {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <p className={className ? `${styles.root} ${className}` : styles.root}>
      <span>{label}</span>
      <time className={styles.digits}>{time || "--:--:--"}</time>
    </p>
  );
};

export default LocalTime;
