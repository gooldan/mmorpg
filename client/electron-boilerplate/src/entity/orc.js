import { BaseObject } from "./BaseObject"

const statusBoxHeight = 15
export class Orc extends BaseObject {
    constructor(id, x, y, hp, level, drawFunc) {
        super(id, x, y, undefined, 2)
        this.drawFunc = drawFunc
        this.state = 0
        this.baseImage = new Image()
        this.baseImage.src = "res/lumber.png"
        this.drawMyself = this.drawBody
        this.hp = hp
        this.level = level
        this.dead = false
    }
    changeState(newState) {
        this.state = newState
    }
    drawBody(ctx, cellBox) {
        const cellBoxCharacter = {
            x: cellBox.x + statusBoxHeight,
            y: cellBox.y + statusBoxHeight,
            width: cellBox.width - statusBoxHeight,
            height: cellBox.height - statusBoxHeight,
        }
        const statusBox = {
            x: cellBox.x,
            y: cellBox.y,
            width: cellBox.width,
            height: statusBoxHeight,
        }
        ctx.drawImage(
            this.baseImage,
            ((Math.floor(this.state / 3)) * 190),
            0, 190, 190, cellBoxCharacter.x, cellBoxCharacter.y, cellBoxCharacter.width, cellBoxCharacter.height,
        )

        if (this.dead) {
            ctx.fillText("DEAD", statusBox.x, statusBox.y + statusBox.height)
        } else {
            ctx.fillText(`hp:${this.hp} lvl:${this.level}`, statusBox.x, statusBox.y + statusBox.height)
        }
        this.state += 1
        if (this.state === 51) {
            this.state = 0
        }
    }
}
