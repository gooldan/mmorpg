// import _ from "lodash"

export class GameEngine {
    constructor(spaceObject) {
        if(arguments.length === 1) {
            this.spaceObject = spaceObject
            this.loadSpace = true
            this.gameTimer = null
        }
        else if (arguments.length === 0) {
            this.loadSpace = false
            this.gameTimer = null
        }
        else {
            this.loadSpace = false
        }
    }

    LoadSpace(spaceObject) {
        this.spaceObject = spaceObject
        this.loadSpace = true
    }

    onObjectUpdated(objId, updateType, updatePayload) {
        switch (updateType) {
        case "pos":
            if (this.spaceObject.onObjectPositionUpdated(updatePayload.position, objId)) {
                this.onSpaceUpdated(this.spaceObject)
            }
            break
        default:
            break
        }
    }
    onSpaceUpdated(newSpace) {
        this.spaceObject = newSpace
        return this.spaceObject
    }
    onGameTick() {
        setTimeout(()=>{this.onGameTick()},100)
    }
    start() {
        onGameTick()
    }
}
