import _ from "lodash"

export class Space {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.map = _.times(width, () => _.times(height, _.constant(null)))
        this.objects = []
    }
    checkExist(obj) {
        return _.isUndefined(this.objects[obj.id])
    }
    loadMap(map) {
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                this.map[i][j] = map[i][j] === '0' ? null : 1
            }
        }
    }
    addObject(obj) {
        if (this.checkExist(obj)) {
            this.objects[obj.id] = obj
            this.map[obj.position.x][obj.position.y] = obj.id
            return true
        }
        return false
    }
    removeObject(obj) {
        if (!this.checkExist(obj)) {
            this.map[obj.position.x][obj.position.y] = null
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
        if (!this.checkExist(oldObj)) {
            const oldPosX = oldObj.position.x
            const oldPosY = oldObj.position.y
            const newPosX = oldPosX + delta.x
            const newPosY = oldPosY + delta.y
            if (this.checkBoundaries(newPosX, newPosY) && _.isNull(this.map[newPosX][newPosY])) {
                this.map[oldPosX][oldPosY] = null
                this.map[newPosX][newPosY] = objId
                oldObj.position = {x:newPosX,y:newPosY}
                return true
            }
        }
        return false
    }
    onObjectMoved(delta, objId) {
        const { position } = this.objects[objId]
        this.map[position.x][position.y] = null
        this.map[position.x + delta.x][position.y + delta.y] = objId
    }
}

