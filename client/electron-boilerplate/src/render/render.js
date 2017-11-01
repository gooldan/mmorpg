import _ from "lodash"

export class Renderer {
    constructor(ctx, space) {
        this.factor = 10
        this.borderWidth = 1
        this.ctx = ctx
        this.space = space
    }
    onSpaceUpdated(space) {
        this.space = space
    }
    onRenderUpdate() {
        const canvasWidth = this.ctx.canvas.clientWidth - 1
        const canvasHeight = this.ctx.canvas.clientHeight - 1
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        const colCount = this.space.width
        const rowCount = this.space.height
        const cellBoxWidth = (canvasWidth) / colCount
        const cellBoxHeight = (canvasHeight) / rowCount
        const drawCellBorder = (ctx, i, j) => {
            const rect = {
                x: i * cellBoxWidth, y: j * cellBoxHeight, width: cellBoxWidth, height: cellBoxHeight,
            }
            ctx.rect(rect.x, rect.y, rect.width, rect.height)
            return rect
        }
        for (let i = 0; i < colCount; ++i) {
            for (let j = 0; j < rowCount; ++j) {
                const cellBox = drawCellBorder(this.ctx, i, j)
                if (!_.isNull(this.space.map[i][j])) {
                    this.space.objects[this.space.map[i][j]].drawMyself(this.ctx, cellBox)
                }
            }
        }
        this.ctx.stroke()
        requestAnimationFrame(() => this.onRenderUpdate())
    }
    start() {
        this.onRenderUpdate()
    }
}
