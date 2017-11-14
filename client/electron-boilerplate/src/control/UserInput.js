import _ from "lodash"

export class UserInput {
    constructor(window, engine, handlerFunc) {
        this.target = window
        this.engine = engine
        this.eventHandler = handlerFunc
        this.keydownEventLoad = false
        this.listener = (event) => { this.onKeyEvent(event) }
        // window.addEventListener('keydown')
    }
    start() {
        if (!this.keydownEventLoad) {
            this.target.addEventListener("keydown", this.listener, false)
            this.keydownEventLoad = true
        }
    }
    stop() {
        this.target.removeEventListener("keydown", this.listener, false)
        this.keydownEventLoad = false
    }
    onKeyEvent(event) {
        console.log("input")
        const inputEvent = { type: "userObjMoved", payload: {} }
        inputEvent.payload.delta = { x: 0, y: 0 }
        inputEvent.payload.objID = this.engine.getUserObjectID()
        const { key } = event
        switch (key) {
        case "w":
            inputEvent.payload.delta.y -= 1
            break
        case "a":
            inputEvent.payload.delta.x -= 1
            break
        case "s":
            inputEvent.payload.delta.y += 1
            break
        case "d":
            inputEvent.payload.delta.x += 1
            break
        default:
            break
        }
        this.engine.onUserEvent(inputEvent)
    }
}
