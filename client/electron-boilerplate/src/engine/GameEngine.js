// import _ from "lodash"

export class GameEngine {
    constructor(userObject, spaceObject, renderObject) {
        this.userObj = userObject
        this.spaceObject = spaceObject
        this.renderObject = renderObject
        this.gameTimer = null
    }

    onRenderUpdated(newRender) {
        this.renderObject = newRender
        return this.renderObject
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
        return this.userObj
    }
    onSpaceUpdated(newSpace) {
        this.spaceObject = newSpace
        this.renderObject.onSpaceUpdated(newSpace)
        return this.spaceObject
    }
    onGameTick() {
        this.renderObject.onRenderUpdate()
    }
    start() {
        this.gameTimer = setInterval(this.onGameTick.bind(this), 500)
    }
}
