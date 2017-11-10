import { BaseObject } from "./BaseObject"

export class Mountain extends BaseObject {
  constructor(id, x, y, drawFunc) {
    super(1, x, y, undefined, 3)
    this.drawFunc = drawFunc
    this.baseImage = new Image()
    this.baseImage.src = "res/mountain.png"
    this.drawMyself = this.drawBody
  }
  drawBody(ctx, cellBox) {
    ctx.drawImage(this.baseImage, 0, 0, 140, 140, cellBox.x, cellBox.y, cellBox.width, cellBox.height)
  }
}
