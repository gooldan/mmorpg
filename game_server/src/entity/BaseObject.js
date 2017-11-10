import _ from "lodash"

export class BaseObject {
    constructor(id, x, y, drawFunc, type) {
        this.id = id
        this.position = { x, y }
        this.drawMyself = drawFunc
        if (type === "Player" || type === "Hero" || type === "Orc" || type === 2) {
            this.type = 2
        } else if (type === "Tree" || type === 1) {
            this.type = 1
        }
        else if (type === 0) {
            this.type === 0
        }
        else {
            this.type === -1
        }
    }
    updatePosition(x, y) {
        this.position.x = x
        this.position.y = y
    }
}
