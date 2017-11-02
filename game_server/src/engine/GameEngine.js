// import _ from "lodash"

export class GameEngine {
    constructor(spaceObject) {
        this.spaceObject = spaceObject
        this.gameTimer = null
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
