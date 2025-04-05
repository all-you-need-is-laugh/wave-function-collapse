import { useCallback, useEffect, useRef, useState } from 'react';

interface ExecutionControls {
  isRunning: boolean;
  start: () => void;
  stop: () => void;
}

export function useIntervalExecution(executeFunction: () => void, interval: number): ExecutionControls {
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        try {
          executeFunction();
        } catch (error) {
          console.error('Error executing function:', error);
          stop();
        }
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, executeFunction, interval, stop]);

  return { isRunning, start, stop };
}
