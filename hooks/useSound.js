import { useCallback } from "react";

const useSound = () => {
  const playMove = useCallback(() => {
    const audio = new Audio("/sounds/move.mp3");
    audio.play().catch(() => {});
  }, []);

  const playWin = useCallback(() => {
    const audio = new Audio("/sounds/win.mp3");
    audio.play().catch(() => {});
  }, []);

  return { playMove, playWin };
};

export default useSound;
