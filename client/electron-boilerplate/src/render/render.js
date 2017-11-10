import _ from "lodash"

export class Renderer {
    constructor(window, ctx, space) {
        this.factor = 10
        this.borderWidth = 1
        this.ctx = ctx
        this.space = space
        space.initDefaultObjects(this)
        this.window = window
        this.drawCellBorder = () => { }
    }
    onSpaceUpdated(space) {
        if (this.space !== space && space !== undefined) {
            this.space = space
        }
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
        const cellBoxWidth = (this.canvasWidth) / this.colCount
        const cellBoxHeight = (this.canvasHeight) / this.rowCount
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
        for (let i = 0; i < this.colCount; ++i) {
            for (let j = 0; j < this.rowCount; ++j) {
                const cellBox = this.drawCellBorder(this.ctx, i, j)
                try {
                    this.space.objects[this.space.map[i][j].type][this.space.map[i][j].id].drawMyself(this.ctx, cellBox)
                }
                catch (err) {
                    console.log(i, j, this.space.map[i][j].type, this.space.map[i][j].id)
                }
            }
        }
        this.ctx.stroke()
    }
    start() {
        //this.onRenderUpdate()
    }
}
