interface ICoordinate {
  x: number;
  y: number;
}

export class Sprite {
  position: ICoordinate;
  height: number;
  width: number;
  image: HTMLImageElement;
  type: string;
  scale: number;
  framesMax: number;
  framesCurrent: number;
  framesElapse: number;
  framesHold: number;
  offset: ICoordinate;

  constructor({
    position,
    src,
    type,
    scale = 1,
    framesMax,
    framesHold,
    offset = {x: 0, y: 0}
  }: {
    position: ICoordinate;
    src: string;
    type: string;
    scale: number;
    framesMax: number;
    framesHold: number;
    offset: ICoordinate;
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = src;
    this.type = type;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapse = 0;
    this.framesHold = framesHold;
    this.offset = offset
  }
  draw(canvas: HTMLCanvasElement) {
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      if (this.type === "bg") {
        ctx.drawImage(
          this.image,
          this.position.x,
          this.position.y,
          canvas.width,
          canvas.height
        );
      } 
      else if (this.type === "status") {
        ctx.drawImage(
          this.image,
          455,
          330,
          200,
          125
        );
      }
      else {
        ctx.drawImage(
          this.image,
          this.framesCurrent * (this.image.width / this.framesMax),
          0,
          this.image.width / this.framesMax,
          this.image.height,
          this.position.x - this.offset.x,
          this.position.y - this.offset.y,
          (this.image.width / this.framesMax) * this.scale!,
          this.image.height * this.scale!
        );
      }
    }
  }

  animateFrames(){
    this.framesElapse++;

    if (this.framesElapse % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update(canvas: HTMLCanvasElement) {
    this.draw(canvas);
    this.animateFrames()
    
  }
}
