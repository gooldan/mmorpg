import _ from "lodash"

export class Renderer {
    constructor(window, ctx, space, camera) {
        this.factor = 10
        this.borderWidth = 1
        this.ctx = ctx
        this.space = space
        space.initDefaultObjects(this)
        this.window = window
        this.drawCellBorder = () => { }
        this.counter = 0
        this.camera = camera
        this.onCameraParametersChanged()
        this.ctx.font = "13px Arial"
    }
    onCameraParametersChanged() {
        this.currentView = this.camera.getCurrentView()
    }
    onSpaceUpdated(space) {
        if (this.space !== space && space !== undefined) {
            this.space = space
        }
        this.counter = 0
        this.onRenderParamsUpdate()
    }
    getDefaultDraw(objType) {
        const defaultDraw = currentfillStyle => (ctx, rect) => {
            ctx.fillStyle = currentfillStyle
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
            ctx.fillStyle = "black"
        }
        switch (objType) {
        case "user":
            return defaultDraw("#FF0000")
        case "enemy":
            return defaultDraw("#0000FF")
        case "tree":
            return defaultDraw("#00FF00")
        default:
            return defaultDraw("#FFFFFF")
        }
    }
    onRenderParamsUpdate() {
        this.canvasWidth = this.ctx.canvas.clientWidth - 1
        this.canvasHeight = this.ctx.canvas.clientHeight - 1
        this.colCount = this.space.width
        this.rowCount = this.space.height
        const cellBoxWidth = (this.canvasWidth) / this.currentView.width
        const cellBoxHeight = (this.canvasHeight) / this.currentView.height

        this.drawCellBorder = (ctx, i, j) => {
            const rect = {
                x: i * cellBoxWidth, y: j * cellBoxHeight, width: cellBoxWidth, height: cellBoxHeight,
            }
            ctx.rect(rect.x, rect.y, rect.width, rect.height)
            return rect
        }
    }
    onRenderUpdate() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.ctx.beginPath()
        if (this.space.unloaded === true) {
            this.counter += 1
            const rect = {
                x: 10, y: (this.canvasHeight / 2) - 5, width: this.canvasWidth - 10, height: 10,
            }
            this.ctx.rect(rect.x, rect.y, rect.width, rect.height)
            rect.width = (rect.width / 30) * this.counter
            this.getDefaultDraw("enemy")(this.ctx, rect)
            if (this.counter === 29) {
                this.counter = 0
            }
        } else {
            for (let i = 0; i < this.currentView.width; ++i) {
                for (let j = 0; j < this.currentView.height; ++j) {
                    const cellBox = this.drawCellBorder(this.ctx, i, j)
                    const currentViewX = i + this.currentView.x
                    const currentViewY = j + this.currentView.y
                    const { type, id } = this.space.map[currentViewX][currentViewY]
                    this.space.objects[type][id].drawMyself(this.ctx, cellBox)
                    // console.log(i, j, this.space.map[i][j].type, this.space.map[i][j].id)
                }
            }
        }
        this.ctx.stroke()
    }
    start() {
        // this.onRenderUpdate()
    }
}
