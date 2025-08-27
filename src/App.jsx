import React, { useRef, useState, useEffect } from 'react';

function App() {
  const [score, setScore] = useState(0);
  const [ballPos, setBallPos] = useState({
    x: window.innerWidth / 2 - 40,
    y: window.innerHeight - 150,
  });

  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  const startTouch = useRef({ x: 0, y: 0 });
  const frameCount = useRef(0);

  const gravity = 0.7;
  const maxFrames = 300;

  const hoop = {
    x: window.innerWidth / 2.15 - 50,
    y: 150,
    width: 100,
    height: 60,
  };

  const ballRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startTouch.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startTouch.current.x;
    const dy = touch.clientY - startTouch.current.y;

    setVelocity({ x: dx * 0.2, y: dy * 0.2 });
    setIsMoving(true);
    frameCount.current = 0;
  };

  useEffect(() => {
    if (!isMoving) return;

    let animation;

    const animate = () => {
      frameCount.current++;

      setBallPos((prev) => {
        const newX = prev.x + velocity.x;
        const newY = prev.y + velocity.y;
        return { x: newX, y: newY };
      });

      setVelocity((prev) => ({
        x: prev.x,
        y: prev.y + gravity,
      }));

      const ballX = ballPos.x;
      const ballY = ballPos.y;
      const ballRadius = 40;

      const collided =
        ballX + ballRadius > hoop.x &&
        ballX - ballRadius < hoop.x + hoop.width &&
        ballY + ballRadius > hoop.y &&
        ballY - ballRadius < hoop.y + hoop.height;

      if (collided) {
        setScore((prev) => prev + 1);
        resetBall(false);
        return;
      }

      if (
        ballY > window.innerHeight ||
        ballX < -100 ||
        ballX > window.innerWidth + 100 ||
        frameCount.current > maxFrames
      ) {
        resetBall(false);
        return;
      }

      animation = requestAnimationFrame(animate);
    };

    animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, [isMoving, velocity, ballPos]);

  const resetBall = (resetScore = true) => {
    setIsMoving(false);
    setBallPos({ x: window.innerWidth / 2 - 40, y: window.innerHeight - 150 });
    setVelocity({ x: 0, y: 0 });
    if (resetScore) setScore(0);
  };

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f0f8ff',
      backgroundImage:
        'url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Basketball_Court_FIBA.svg/2560px-Basketball_Court_FIBA.svg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
      touchAction: 'none',
    },
    title: {
      textAlign: 'center',
      fontSize: '2.2rem',
      color: 'white',
      textShadow: '1px 1px 4px black',
      marginTop: 60,
    },
    hoop: {
      position: 'absolute',
      top: hoop.y,
      left: hoop.x,
      width: hoop.width,
      height: hoop.height,
      border: '5px solid orange',
      borderBottom: 'none',
      borderRadius: '0 0 60px 60px',
      background: 'rgba(255, 165, 0, 0.1)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    net: {
      width: '100%',
      height: 30,
      backgroundColor: 'rgba(255,255,255,0.7)',
      position: 'absolute',
      bottom: 0,
      borderBottomLeftRadius: '60px',
      borderBottomRightRadius: '60px',
    },
    ball: {
      position: 'absolute',
      left: ballPos.x,
      top: ballPos.y,
      width: 87,
      height: 87,
      backgroundColor: 'orange',
      border: '4px solid brown',
      borderRadius: '50%',
      boxShadow: '0 6px 10px rgba(0,0,0,0.4)',
    },
    button: {
      position: 'absolute',
      bottom: 60, // <-- Puedes ajustar aquí para subir o bajar el botón
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '14px 24px',
      fontSize: '1rem',
      backgroundColor: '#ff5722',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
      cursor: 'pointer',
    },
  };

  return (
    <div
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h1 style={styles.title}>🏀 Puntos: {score}</h1>

      {/* Canasta */}
      <div style={styles.hoop}>
        <div style={styles.net}></div>
      </div>

      {/* Pelota */}
      <div ref={ballRef} style={styles.ball}></div>

      {/* Botón para reiniciar */}
      <button style={styles.button} onClick={() => resetBall(true)}>
        🔄 Volver a Intentar
      </button>
    </div>
  );
}

export default App;
