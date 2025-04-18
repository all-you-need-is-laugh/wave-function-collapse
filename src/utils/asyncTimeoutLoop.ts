export const asyncTimeoutLoop = async (
  start: number,
  end: number,
  callback: (index: number) => void,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let index = start;

    const processNext = () => {
      try {
        if (index < end) {
          callback(index++);
          setTimeout(processNext, 0);
        } else {
          resolve();
        }
      } catch (error) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error(`An unknown error occurred: ${String(error)}`));
        }
      }
    };

    processNext();
  });
};
