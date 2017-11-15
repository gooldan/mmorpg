import { BaseObject } from "./BaseObject"

export class Tree extends BaseObject {
    constructor(id, x, y, drawFunc) {
        super(id, x, y, undefined, 1)
        this.drawFunc = drawFunc
        this.baseImage = new Image()
        this.baseImage.src = "res/tree.png"
        this.drawMyself = this.drawBody
    }
    drawBody(ctx, cellBox) {
        ctx.drawImage(this.baseImage, 0, 0, 39, 39, cellBox.x, cellBox.y, cellBox.width, cellBox.height)
    }
}
