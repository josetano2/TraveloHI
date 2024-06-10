import { Sprite } from "./sprite";

const gravity = 0.7;

interface ICoordinate {
  x: number;
  y: number;
}

interface IAttackBox {
  position: ICoordinate;
  width: number;
  height: number;
  offset: ICoordinate;
}

// interface ISpriteState {
//   src: string;
//   framesMax: number;
// }

// interface ISpriteAnimation{
//   [key: string]: ISpriteState;
// }

export class Player extends Sprite {
  color: string;
  velocity: ICoordinate;
  height: number;
  width: number;
  attackBox: IAttackBox;
  isAttacking: boolean;
  isJumping: boolean;
  health: number;
  lowKickDamage: number;
  frontKickDamage: number;
  sprites: any;
  currentDamage: number;
  facingLeft: boolean;

  constructor({
    position,
    color,
    velocity,
    offset,
    src,
    scale,
    framesMax,
    framesHold,
    type = "player",
    sprites,
    health,
    lowKickDamage,
    frontKickDamage,
    facingLeft,
  }: {
    position: ICoordinate;
    color: string;
    velocity: ICoordinate;
    offset: ICoordinate;
    src: string;
    scale: number;
    framesMax: number;
    framesHold: number;
    type: string;
    sprites: any;
    health: number;
    lowKickDamage: number;
    frontKickDamage: number;
    facingLeft: boolean
  }) {
    super({ position, src, type, scale, framesMax, framesHold, offset });
    this.color = color;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset: offset,
    };
    this.isAttacking = false;
    this.isJumping = false;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapse = 0;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].src;
    }

    this.health = health;
    this.lowKickDamage = lowKickDamage;
    this.frontKickDamage = frontKickDamage;
    this.currentDamage = 0;
    this.facingLeft = facingLeft
  }

  update(canvas: HTMLCanvasElement) {
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x = 0;
    }

    if (this.position.x + this.width > canvas.width) {
      this.position.x = canvas.width - this.width;
      this.velocity.x = 0;
    }

    if(this.velocity.x > 0){
      this.facingLeft = false;
    }
    else if(this.velocity.x < 0){
      this.facingLeft = true;
    }

    this.draw(canvas);
    this.animateFrames();

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.position.y = 550.5;
    } else {
      this.velocity.y += gravity;
    }
    // console.log(this.position.y)
  }

  attackLowKick() {
    if (this.isAttacking) {
      return;
    }
    this.switchSprite("lowKick");
    this.currentDamage = this.lowKickDamage
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  attackFrontKick() {
    if (this.isAttacking) {
      return;
    }
    this.switchSprite("frontKick");
    this.currentDamage = this.frontKickDamage
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  jump() {
    this.isJumping = true;
    this.velocity.y = -15;
    setTimeout(() => {
      this.isJumping = false;
    }, 750);
  }

  switchSprite(sprite: any) {
    if (
      (this.image === this.sprites.lowKick.image &&
      this.framesCurrent < this.sprites.lowKick.framesMax - 1)
      ||
      (this.image === this.sprites.frontKick.image &&
        this.framesCurrent < this.sprites.frontKick.framesMax - 1)
    ) {
      return;
    }
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "lowKick":
        if (this.image !== this.sprites.lowKick.image) {
          this.image = this.sprites.lowKick.image;
          this.framesMax = this.sprites.lowKick.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "frontKick":
        if (this.image !== this.sprites.frontKick.image) {
          this.image = this.sprites.frontKick.image;
          this.framesMax = this.sprites.frontKick.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
