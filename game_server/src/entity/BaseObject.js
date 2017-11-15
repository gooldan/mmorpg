import _ from "lodash"

export class BaseObject {
    constructor(id, x, y, type, hp, level) {
        this.id = id
        this.position = { x, y }
        this.type = type
        this.hp = hp
        this.level = level
    }
    updatePosition(x, y) {
        this.position.x = x
        this.position.y = y
    }
}
