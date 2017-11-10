import _ from "lodash"

export class Space {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.map = _.times(width, () => _.times(height, _.constant(null)))
        this.objects = {}
        
    }
    checkExist(obj) {
        return _.isUndefined(this.objects[obj])
    }
    loadMap(map) {
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                this.map[i][j] = map[i][j]
            }
        }
    }
    addObject(obj) {
        if (this.checkExist(obj)) {
            this.objects[obj.id] = obj
            this.map[obj.position.x][obj.position.y] = {type: obj.type, id: obj.id}
            return true
        }
        return false
    }
    removeObject(obj) {
        if (!this.checkExist(obj)) {
            this.map[obj.position.x][obj.position.y] = {type: 0, id: 0}
            delete this.objects[obj.id]
            return true
        }
        return false
    }
    checkBoundaries(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height
    }
    onObjectPositionUpdated(delta, objId) {
        const oldObj = this.objects[objId]
        if (oldObj !== undefined) {
            const oldPosX = oldObj.position.x
            const oldPosY = oldObj.position.y
            const newPosX = oldPosX + delta.x
            const newPosY = oldPosY + delta.y
            if (this.checkBoundaries(newPosX, newPosY) && this.map[newPosX][newPosY].type === 0 && this.map[newPosX][newPosY].id === 0) {
                this.map[oldPosX][oldPosY] = {type: 0, id: 0}
                this.map[newPosX][newPosY] = {id: objId, type: 2}
                oldObj.position = {x:newPosX,y:newPosY}
                return true
            }
        }
        return false
    }
    onObjectMoved(delta, objId) {
        const { position } = this.objects[objId]
        this.map[position.x][position.y] = {type: 0, id: 0}
        this.map[position.x + delta.x][position.y + delta.y] = {id: objId, type: 2}
    }
}

