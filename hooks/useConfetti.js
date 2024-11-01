import { useCallback } from "react";
import confetti from "canvas-confetti";

const useConfetti = () => {
  const fireConfetti = useCallback(() => {
    // Fire from left edge
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.1, y: 0.6 },
    });

    // Fire from right edge
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
      });
    }, 250);
  }, []);

  return fireConfetti;
};

export default useConfetti;
