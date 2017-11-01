import _ from "lodash"
class Renderer {
    constructor(ctx, space) {
        this.spacing = 5
        this.factor = 10

        this.ctx = ctx
        this.space = space
    }
    onSpaceUpdate(space) {
        this.space = space
    }
    onRenderUpdate() {
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                if (_.isNull(this.space.map[i][j])) {
                    this.ctx.rect(i + this.spacing, j + this.spacing, this.factor + this.spacing, this.factor + this.spacing)
                }
            }
        }
    }
}
