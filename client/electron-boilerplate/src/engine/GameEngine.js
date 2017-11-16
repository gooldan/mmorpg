// import _ from "lodash"
import { BaseObject } from "./../entity/BaseObject"
import { Orc } from "./../entity/orc"
import { EnemyOrc } from "./../entity/enemyOrc"
import { Tree } from "./../entity/tree"
import { Space } from "./space"
import { Mountain } from "./../entity/mountain"
import { Portal } from "./../entity/portal"

export class GameEngine {
    constructor(spaceObject, renderObject) {
        this.spaceObject = spaceObject
        this.renderObject = renderObject
        this.userInput = null
        this.networkObject = null
        this.gameTimer = null
        this.userObj = null
        this.mainGameLoop = () => {}
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
        if (!this.spaceObject.unloaded) {
            this.networkObject.eventOccured(event)
        }
    }
    onNetworkEvent(event) {
        switch (event.type) {
        case "enterWorld": {
            this.userInput.stop()
            this.spaceObject.reconstruct(15, 15)
            this.spaceObject.initDefaultObjects(this.renderObject)
            const {
                objects, userObj, locationID, mountains,
            } = event.payload
            this.locationID = locationID
            for (const im in mountains) {
                const mountain = mountains[im]
                this.spaceObject.map[mountain.position.x][mountain.position.y] = { type: 3, id: 0 }
            }

            if (objects[2] !== undefined) {
                for (const iobj in objects[2]) {
                    const obj = objects[2][iobj]
                    if (obj.id !== userObj.id) {
                        const newObject = new EnemyOrc(obj.id, obj.position.x, obj.position.y, obj.hp, obj.level, this.renderObject.getDefaultDraw("userEnemy"), 2)
                        this.spaceObject.addObject(newObject)
                    }
                }
            }
            if (objects[1] !== undefined) {
                for (const iobj in objects[1]) {
                    const obj = objects[1][iobj]
                    const newObject = new Tree(obj.id, obj.position.x, obj.position.y, this.renderObject.getDefaultDraw("tree"), 1)
                    this.spaceObject.addObject(newObject)
                }
            }
            /* if (objects[4] !== undefined) {
                    for (let iobj in objects[4]) {
                        let obj = objects[4][iobj]
                        const newObject = new Portal(obj.id, obj.position.x, obj.position.y, this.renderObject.getDefaultDraw("portal"), 1)
                        this.spaceObject.addObject(newObject)
                    }
                } */
            this.userObj = new Orc(userObj.id, userObj.position.x, userObj.position.y, userObj.hp, userObj.level, this.renderObject.getDefaultDraw("user"), 2)
            this.spaceObject.addObject(this.userObj)
            this.onSpaceUpdated()
            this.renderObject.camera.onCameraCenterChanged({ ...this.userObj.position })
            this.renderObject.onCameraParametersChanged()
            this.userInput.start()

            // this.renderObject.start()
            break
        }
        case "objMoved": {
            const { objID, delta } = event.payload
            this.spaceObject.onObjectMoved(delta, objID, 2)
            if (objID === this.userObj.id) {
                this.renderObject.camera.onCameraCenterChanged({ ...this.userObj.position })
                this.renderObject.onCameraParametersChanged()
            }
            this.onSpaceUpdated()
            break
        }
        case "objectEnter": {
            const {
                objID, position, objType, hp, level,
            } = event.payload
            if (objType === 2) {
                const newObj = new EnemyOrc(objID, position.x, position.y, hp, level, this.renderObject.getDefaultDraw("enemy"), objType)
                this.spaceObject.addObject(newObj)
            } else if (objType === 1) {
                const newObj = new Tree(objID, position.x, position.y, this.renderObject.getDefaultDraw("tree"), objType)
                this.spaceObject.addObject(newObj)
            }
            this.onSpaceUpdated()
            break
        }
        case "objectLeave": {
            const { objID, position, objType } = event.payload
            this.spaceObject.removeObject(objID, objType)
            // this.userInput.stop()
            this.onSpaceUpdated()
            break
        }
        case "leaveWorld": {
            this.userInput.stop()
            this.spaceObject.unloaded = true
            this.onSpaceUpdated()
            break
        }
        case "playersDamaged": {
            for (const ind in event.payload.playersInfo) {
                this.spaceObject.onPlayerDamaged(event.payload.playersInfo[ind].id, event.payload.playersInfo[ind].dmg)
            }
            break
        }
        case "playerLvlUp": {
            this.spaceObject.onPlayerLvlUp(event.payload.objId, event.payload.newLevel)
            break
        }
        case "playerDead": {
            this.spaceObject.onPlayerDead(event.payload.objId)
            break
        }
        case "playerRespawn": {
            this.spaceObject.onPlayerRespawn(event.payload.objId, event.payload.newPos, event.payload.newHp)
            if (event.payload.objId === this.userObj.id) {
                this.renderObject.camera.onCameraCenterChanged({ ...this.userObj.position })
                this.renderObject.onCameraParametersChanged()
            }
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
        this.onSpaceUpdated()
        this.renderObject.camera.onCameraCenterChanged({ x: 5, y: 5 })
        this.renderObject.onCameraParametersChanged()
    }
}
