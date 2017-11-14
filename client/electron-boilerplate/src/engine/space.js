import _ from "lodash"
import { BaseObject } from "./../entity/BaseObject"
import { Mountain } from "./../entity/mountain"

export class Space {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.map = _.times(width, () => _.times(height, _.constant({ type: 0, id: 0 })))
        this.objects = []
        this.objects[0] = {}
        this.objects[1] = {}
        this.objects[2] = {}
        this.objects[3] = {}
        this.objects[4] = {}
        this.unloaded = true
    }

    initDefaultObjects(renderer) {
        this.unloaded = false
        this.objects[0][0] = new BaseObject(0, undefined, undefined, renderer.getDefaultDraw("qwe"), 0)
        this.objects[3][0] = new Mountain(1, undefined, undefined, renderer.getDefaultDraw("qwe"))
    }

    reconstruct(width, height) {
        this.unloaded = true
        this.width = width
        this.height = height
        this.map = _.times(width, () => _.times(height, _.constant({ type: 0, id: 0 })))
        this.objects = []
        this.objects[0] = {}
        this.objects[1] = {}
        this.objects[2] = {}
        this.objects[3] = {}
        this.objects[4] = {}
    }

    checkExist(obj) {
        return this.objects[obj.type][obj.id] === undefined
    }
    loadMap(map) {
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                this.map[i][j] = map[i][j] === 0 ? { type: 0, id: 0 } : { type: 0, id: 1 }
            }
        }
    }
    addObject(obj) {
        if (this.checkExist(obj)) {
            if (this.objects[obj.type] === undefined) { this.objects[obj.type] = {} }
            this.objects[obj.type][obj.id] = obj
            this.map[obj.position.x][obj.position.y] = { id: obj.id, type: obj.type }
            return true
        }
        return false
    }
    removeObject(objID, objType) {
        const obj = this.objects[objType][objID]
        if (!this.checkExist(obj)) {
            this.map[obj.position.x][obj.position.y] = { type: 0, id: 0 }
            delete this.objects[obj.type][obj.id]
            return true
        }
        return false
    }
    checkBoundaries(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height
    }
    onObjectPositionUpdated(position, objId, objType) {
        const oldObj = this.objects[objType][objId]
        if (!this.checkExist(oldObj)) {
            const oldPosX = oldObj.position.x
            const oldPosY = oldObj.position.y
            if (this.checkBoundaries(position.x, position.y) && this.map[position.x][position.y].type === 0 && this.map[position.x][position.y].id === 0) {
                this.map[oldPosX][oldPosY] = { type: 0, id: 0 }
                this.map[position.x][position.y] = { id: objId, type: 2 }
                oldObj.position = position
                return true
            }
        }
        return false
    }
    onObjectMoved(delta, objId, objType) {
        if (this.unloaded && this.objects[objType][objId] !== undefined) {
            return
        }
        const { position } = this.objects[objType][objId]
        this.map[position.x][position.y] = { type: 0, id: 0 }
        console.log("HEHE: ", position.x + delta.x)
        this.map[position.x + delta.x][position.y + delta.y] = { id: objId, type: 2 }
        this.objects[objType][objId].position.x = position.x + delta.x
        this.objects[objType][objId].position.y = position.y + delta.y
    }
}

