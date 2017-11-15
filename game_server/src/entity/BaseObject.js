import _ from "lodash"

export class BaseObject {
    constructor(id, x, y, type, hp) {
        this.id = id
        this.position = { x, y }
        this.type = type
        this.hp = hp
    }
    updatePosition(x, y) {
        this.position.x = x
        this.position.y = y
    }
}
