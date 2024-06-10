import { Player } from "./class/player";
import { Sprite } from "./class/sprite";
import bgImg from "../../assets/game-asset/Game Asset/background/background.png";
import winIMg from "../../assets/game-asset/Game Asset/win.png";
import loseImg from "../../assets/game-asset/Game Asset/lose.png";

import player_idle from "../../assets/game-asset/Player 1/Sprites/Idle.png";
import player_run from "../../assets/game-asset/Player 1/Sprites/Run.png";
import player_jump from "../../assets/game-asset/Player 1/Sprites/Jump.png";
import player_fall from "../../assets/game-asset/Player 1/Sprites/Fall.png";
import player_low_kick from "../../assets/game-asset/Player 1/Sprites/Attack2.png";
import player_front_kick from "../../assets/game-asset/Player 1/Sprites/Attack1.png";

import enemy_idle from "../../assets/game-asset/Player 2/Sprites/Idle.png";
import { useUser } from "../../context/user-context";
import { ILoggedUser } from "../../interfaces/user-interface";

let isDone = false;
let rewardGiven = false;

const player = new Player({
  position: { x: 100, y: 400 },
  color: "red",
  velocity: { x: 0, y: 0 },
  offset: { x: 215, y: 180 },
  src: player_idle,
  framesMax: 8,
  framesHold: 5,
  scale: 2.5,
  type: "player",
  sprites: {
    idle: {
      src: player_idle,
      framesMax: 8,
    },
    run: {
      src: player_run,
      framesMax: 8,
    },
    jump: {
      src: player_jump,
      framesMax: 2,
    },
    fall: {
      src: player_fall,
      framesMax: 2,
    },
    lowKick: {
      src: player_low_kick,
      framesMax: 6,
    },
    frontKick: {
      src: player_front_kick,
      framesMax: 6,
    },
  },
  health: 100,
  lowKickDamage: 15,
  frontKickDamage: 10,
  facingLeft: false,
});

const enemy = new Player({
  position: { x: 950, y: 400 },
  color: "blue",
  velocity: { x: 120, y: 0 },
  offset: { x: 315, y: 190 },
  src: enemy_idle,
  framesMax: 4,
  framesHold: 5,
  scale: 2.5,
  type: "enemy",
  sprites: {
    idle: {
      src: player_idle,
      framesMax: 8,
    },
    run: {
      src: player_run,
      framesMax: 8,
    },
  },
  health: 100,
  lowKickDamage: 15,
  frontKickDamage: 10,
  facingLeft: true,
});

const bg = new Sprite({
  position: { x: 0, y: 0 },
  src: bgImg,
  type: "bg",
  scale: 1,
  framesMax: 0,
  framesHold: 10,
  offset: { x: 0, y: 0 },
});

const win = new Sprite({
  position: { x: 0, y: 0 },
  src: winIMg,
  type: "status",
  scale: 1,
  framesMax: 0,
  framesHold: 10,
  offset: { x: 0, y: 0 },
});
const lose = new Sprite({
  position: { x: 0, y: 0 },
  src: loseImg,
  type: "status",
  scale: 1,
  framesMax: 0,
  framesHold: 10,
  offset: { x: 0, y: 0 },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
};

let lastKey: string;

function collisionChecker({ p1, p2 }: { p1: Player; p2: Player }) {
  return (
    p1.attackBox.position.x + p1.attackBox.width >= p2.position.x &&
    p1.attackBox.position.x <= p2.position.x + p2.width &&
    p1.attackBox.position.y + p1.attackBox.height >= p2.position.y &&
    p1.attackBox.position.y <= p2.position.y + p2.height
  );
}

export async function animate(canvas: HTMLCanvasElement, user: ILoggedUser) {
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bg.update(canvas);
      player.update(canvas);
      enemy.update(canvas);
      window.requestAnimationFrame(() => animate(canvas, user));

      if (enemy.health <= 0) {
        // player menang
        isDone = true;
        player.switchSprite("idle");
        ctx.drawImage(win.image, 455, 330, 200, 125);

        // reward
        if (!rewardGiven) {
          const response = await fetch(
            "http://localhost:8080/api/game_reward",
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                id: user.ID,
              }),
            }
          );

          if (response.ok) {
            console.log(user.WalletAmount);
            rewardGiven = true;
            console.log(rewardGiven);
          }
          return;
        }
        return;
      } else if (player.health <= 0) {
        // player kalah
        isDone = true;
        player.switchSprite("idle");
        ctx.drawImage(lose.image, 455, 330, 200, 125);
        return;
      }
    }
    player.velocity.x = 0;
    // player.image = player.sprites.idle.image

    if (keys.a.pressed && lastKey === "a") {
      player.velocity.x = -5;
      player.switchSprite("run");
    } else if (keys.d.pressed && lastKey === "d") {
      player.velocity.x = 5;
      player.switchSprite("run");
    } else {
      player.switchSprite("idle");
    }

    if (player.velocity.y < 0) {
      player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
      player.switchSprite("fall");
    }

    if (
      collisionChecker({
        p1: player,
        p2: enemy,
      }) &&
      player.isAttacking
    ) {
      player.isAttacking = false;
      const enemyhp = document.getElementById("enemy_health");
      if (enemyhp) {
        enemy.health -= player.currentDamage;
        if (enemy.health < 0) {
          enemyhp.style.width = "0";
        }
        enemyhp.style.width = enemy.health + "%";
      }
    }

    if (
      collisionChecker({
        p1: enemy,
        p2: player,
      }) &&
      enemy.isAttacking
    ) {
      enemy.isAttacking = false;
    }
  }
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      if (!player.isJumping) {
        player.jump();
      }
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
    case "s":
      keys.s.pressed = true;
      break;
    case " ":
      if (!isDone) {
        if (keys.a.pressed || keys.d.pressed) {
          player.attackFrontKick();
        } else if (keys.s.pressed) {
          player.attackLowKick();
        }
      }
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
  }
});
