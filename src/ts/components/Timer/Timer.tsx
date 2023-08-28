import React from "react";
import { flushSync } from "react-dom";

import style from "./styles.module.css";

export function Timer({ run = true }: { run?: boolean }) {
  const [hours, minutes, seconds, ms] = useTimer(run);

  return (
    <span className={style.timer}>
      <span className={style.hours}>{hours}</span>
      <span className={style.minutes}>{minutes}</span>
      <span className={style.seconds}>{seconds}</span>
      <span className={style.milliseconds}>{ms}</span>
    </span>
  );
}

function useTimer(run: boolean) {
  const [et, setElapsedTime] = React.useState(0);
  const started = React.useRef(Date.now());
  const offset = React.useRef(0);


  const hours = Math.floor(et / (60 * 60 * 1000));
  const minutes = Math.floor((et / (60 * 1000)) % 60);
  const seconds = Math.floor((et / 1000) % 60);
  const ms = Math.floor(et % 1000);

  React.useEffect(() => {
    let interval = 0;

    if (run) {
      interval = setInterval(() => {
        flushSync(() => {
          const now = Date.now();
          setElapsedTime(now - started.current + offset.current);
        });
      }, 75);
    }

    return () => {
      if (run) {
        offset.current = Date.now() - started.current + offset.current;
      } else {
        started.current = Date.now();
      }
      clearInterval(interval);
    };
  }, [run]);

  return [
    leadingZeros(hours),
    leadingZeros(minutes),
    leadingZeros(seconds),
    leadingZeros(ms, 3),
  ];
}

function leadingZeros(number: number, decimals = 2) {
  const offset = decimals - number.toString().length;
  return "0".repeat(offset) + number;
}

function formatTimeSeconds(t: number) {
  return (t / 1000).toFixed(2);
}
