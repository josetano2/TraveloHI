import { useEffect, useRef, useState } from "react";
import { animate } from "./game-script";
import styles from "./game.module.scss";
import { useNavigate } from "react-router-dom";
import bgm from "../../assets/game-asset/Game Asset/background music 1.mp3";
import NavBar from "../../components/navbar/navbar";
import { useUser } from "../../context/user-context";
import { API_BASE_URL } from "../../config/config";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timer, setTimer] = useState(120);
  const navigate = useNavigate();
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useUser();

  const validateUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        navigate(`/login`);
      }
    } catch (error) {
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    validateUser();
    if (canvasRef.current && user) {
      animate(canvasRef.current, user);
    }
    const interval = setInterval(() => {
      setTimer((prevTimer: number) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar />
      <div className={styles.main_container}>
        <div className={styles.secondary_container}>
          <div className={styles.hud_container}>
            <div className={styles.player_health_container}>
              <div className={styles.health}></div>
              <div id="player_health" className={styles.absolute}></div>
            </div>
            <div className={styles.timer}>{timer}</div>
            <div className={styles.enemy_health_container}>
              <div className={styles.health}></div>
              <div id="enemy_health" className={styles.absolute}></div>
            </div>
            <audio src={bgm} autoPlay loop preload="auto"></audio>
          </div>
          <canvas
            className={styles.canvas}
            ref={canvasRef}
            width="1100"
            height="700"
          ></canvas>
        </div>
      </div>
    </>
  );
}
