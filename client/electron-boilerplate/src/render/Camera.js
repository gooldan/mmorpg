
export class Camera {
    constructor(width, height, center, space) {
        this.width = width
        this.height = height
        this.center = center
        this.space = space
    }

    onCameraCenterChanged(newCenter) {
        this.center = newCenter
        if (this.center.x - ((this.width - 1) / 2) < 0) {
            this.center.x = (this.width - 1) / 2
        }
        if (this.center.y - ((this.height - 1) / 2) < 0) {
            this.center.y = (this.height - 1) / 2
        }
        if (this.center.x + ((this.width - 1) / 2) > this.space.width - 1) {
            this.center.x = this.space.width - ((this.width - 1) / 2) - 1
        }
        if (this.center.y + ((this.height - 1) / 2) > this.space.height - 1) {
            this.center.y = this.space.height - ((this.height - 1) / 2) - 1
        }
    }
    onSpaceChanged(newSpace) {
        this.space = newSpace
    }
    getCurrentView() {
        const x = this.center.x - ((this.width - 1) / 2)
        const y = this.center.y - ((this.height - 1) / 2)
        return {
            x, y, width: this.width, height: this.height,
        }
    }
}
