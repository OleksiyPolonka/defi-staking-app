import React, { useState, useEffect } from "react";

function Airdrop({ stakingBalance, decentralBankContract }) {
  const [time, setTime] = useState({});
  const [seconds, setSeconds] = useState(20);

  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };

    return obj;
  };

  const countDown = () => {
    setSeconds((prevSeconds) => {
      const newSeconds = prevSeconds - 1;

      if (newSeconds === 0) {
        stopTimer();
        decentralBankContract.methods.issueTokens();
        setSeconds(20);
      }
      setTime(secondsToTime(newSeconds));
      return newSeconds;
    });
  };

  const startTimer = async () => {
    if (seconds > 0) {
      const timerId = setInterval(countDown, 1000);
      return timerId;
    }
  };

  const stopTimer = (timerId) => {
    clearInterval(timerId);
  };

  useEffect(() => {
    setTime(secondsToTime(seconds));

    let stakingB = stakingBalance;
    if (stakingB <= "50000000000000000000") {
      const timerId = startTimer();
      return () => stopTimer(timerId); // clear interval on unmount or change
    }
  }, [stakingBalance]);

  return (
    <div style={{ color: "black" }}>
      {time.m}:{time.s}
    </div>
  );
}

export default Airdrop;
