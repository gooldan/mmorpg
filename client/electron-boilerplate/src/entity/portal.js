import { BaseObject } from "./BaseObject"

export class Portal extends BaseObject {
  constructor(id, x, y, drawFunc) {
    super(id, x, y, undefined, 4)
    this.drawFunc = drawFunc
  }
}
