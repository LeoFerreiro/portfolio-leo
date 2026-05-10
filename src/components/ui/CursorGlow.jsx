import { useEffect, useState } from "react";

function CursorGlow() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () =>
      window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-0"
      style={{
        transform: `translate(${position.x - 150}px, ${position.y - 150}px)`,
      }}
    >
      <div
        className="w-[300px] h-[300px]
        bg-blue-500/20 rounded-full blur-3xl"
      />
    </div>
  );
}

export default CursorGlow;