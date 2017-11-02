import _ from "lodash"

export class BaseObject {
    constructor(id, x, y, drawFunc) {
        this.id = id
        this.position = { x, y }
        this.drawMyself = drawFunc
    }
    updatePosition(x, y) {
        this.position.x = x
        this.position.y = y
    }
}
