import React, { useEffect, useRef } from "react";

export const useInterval = (callback: () => any, delay: number) => {
  const savedCallback: { current: () => any } = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback !== undefined && savedCallback.current !== undefined) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
