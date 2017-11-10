import { BaseObject } from "./BaseObject"

export class Orc extends BaseObject {
    constructor(id, x, y, drawFunc) {
        super(id, x, y, undefined, 2)
        this.drawFunc = drawFunc
        this.state = 0
        this.baseImage = new Image()
        this.baseImage.src = "res/lumber.png"
        this.drawMyself = this.drawBody
    }
    changeState(newState) {
        this.state = newState
    }
    drawBody(ctx, cellBox) {
        ctx.drawImage(this.baseImage, ((Math.floor(this.state / 3)) * 190), 0, 190, 190, cellBox.x, cellBox.y, cellBox.width, cellBox.height)
        this.state += 1
        if (this.state === 51) {
            this.state = 0
        }
    }
}
