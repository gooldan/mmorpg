import _ from "lodash"

export class UserInput {
    constructor(window, engine) {
        this.target = window
        this.obj = null
        this.engine = engine
        // window.addEventListener('keydown')
    }
    start(obj) {
        this.obj = obj
        this.target.addEventListener("keyup", this.onKeyEvent.bind(this), false)
    }
    onKeyEvent(event) {
        if (!_.isNull(this.obj)) {
            console.log(this.obj)
            const newPos = { ...this.obj.position }
            const { key } = event
            console.log(key)
            switch (key) {
            case "w":
                newPos.y -= 1
                break
            case "a":
                newPos.x -= 1
                break
            case "s":
                newPos.y += 1
                break
            case "d":
                newPos.x += 1
                break
            default:
                break
            }
            this.objectPositionChanged(newPos)
        }
    }
    objectPositionChanged(newPos) {
        console.log(newPos)
        this.obj = this.engine.onObjectUpdated(this.obj.id, "pos", { position: newPos })
    }
}
