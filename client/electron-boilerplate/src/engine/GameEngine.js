// import _ from "lodash"
import { BaseObject } from "./../entity/BaseObject"
import { Orc } from "./../entity/orc"
import { Tree } from "./../entity/tree"

export class GameEngine {
    constructor(spaceObject, renderObject) {
        this.spaceObject = spaceObject
        this.renderObject = renderObject
        this.userInput = null
        this.networkObject = null
        this.gameTimer = null
        this.userObj = null
    }
    setNetworkObject(obj) {
        this.networkObject = obj
    }
    setUserInput(obj) {
        this.userInput = obj
    }

    onRenderUpdated(newRender) {
        this.renderObject = newRender
        return this.renderObject
    }

    // TODO: objId заменить на obj с полями. 
    onObjectUpdated(objId, updateType, updatePayload) {
        switch (updateType) {
            case "pos":
                if (this.spaceObject.onObjectPositionUpdated(updatePayload.position, objId, 2)) {
                    this.onSpaceUpdated(this.spaceObject)
                }
                break
            default:
                break
        }
        return this.userObj
    }
    onSpaceUpdated(newSpace) {
        if (newSpace !== undefined) {
            this.spaceObject = newSpace
        }
        this.renderObject.onSpaceUpdated(this.spaceObject)
        return this.spaceObject
    }
    onGameTick() {
        // this.renderObject.onRenderUpdate()
    }
    onUserEvent(event) {
        this.networkObject.eventOccured(event)
    }
    onNetworkEvent(event) {
        switch (event.type) {
            case "enterWorld": {
                const { objects, userObj, entityObjects } = event.payload
                objects.forEach((obj) => {
                    if (obj.id !== userObj.id) {
                        const newObject = new BaseObject(obj.id, obj.position.x, obj.position.y, this.renderObject.getDefaultDraw("enemy"), 2)
                        this.spaceObject.addObject(newObject)
                    }
                })
                entityObjects.forEach((obj) => {
                    if (obj.type === 1) {
                        const newObject = new Tree(obj.id, obj.position.x, obj.position.y, this.renderObject.getDefaultDraw("tree"), 1)
                        this.spaceObject.addObject(newObject)
                    }
                })
                this.userObj = new Orc(userObj.id, userObj.position.x, userObj.position.y, this.renderObject.getDefaultDraw("user"), 2)
                this.spaceObject.addObject(this.userObj)
                this.onSpaceUpdated()
                this.userInput.start()
                // this.renderObject.start()
                break
            }
            case "objMoved": {
                const { objID, delta } = event.payload
                this.spaceObject.onObjectMoved(delta, objID, 2)
                this.onSpaceUpdated()
                break
            }
            case "objectEnter": {
                const { objID, position, objType } = event.payload
                if (objType === 2) {
                    const newObj = new BaseObject(objID, position.x, position.y, this.renderObject.getDefaultDraw("enemy"), objType)
                    this.spaceObject.addObject(newObj)
                }
                else if (objType === 1) {
                    const newObj = new Tree(objID, position.x, position.y, this.renderObject.getDefaultDraw("tree"), objType)
                    this.spaceObject.addObject(newObj)
                }
                this.onSpaceUpdated()
                break
            }
            case "objectLeave": {
                const { objID, position, objType } = event.payload
                this.spaceObject.removeObject(objID, objType)
                this.onSpaceUpdated()
                break
            }
            default: {
                break
            }
        }
    }
    getUserObjectID() {
        if (this.userObj !== undefined) {
            return this.userObj.id
        }
        return -1
    }

    start(token) {
        this.networkObject.connectToServer("127.0.0.1", "8081")
        this.networkObject.login(token)
    }
}
