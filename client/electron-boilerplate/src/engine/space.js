import _ from "lodash"

export class Space {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.map = _.times(width, ()=>{return _.times(height, _.constant(null))})
        this.objects = []
    }
    checkExist(obj) {
        return _.isUndefined(this.objects[obj.id])
    }
    loadMap(map) {
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                this.map = map[i][j]
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
    updateObjPosition(obj) {
        if (this.checkExist(obj)) {
            const oldPosX = this.objects[obj.id].position.x
            const oldPosY = this.objects[obj.id].position.y
            if (_.isNull(this.map[obj.position.x][obj.position.y])) {
                this.map[oldPosX][oldPosY] = null
                this.map[obj.position.x][obj.position.y] = obj.id
                return true
            }
        }
        return false
    }
}

