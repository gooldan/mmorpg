import io from "socket.io-client"

export class ClientNetwork {
    constructor(gameEngine) {
        this.socket = null
        this.gameEngine = gameEngine
        this.logNet = true
    }
    connectToServer(ip, port) {
        this.socket = io(`http://${ip}:${port}/`)
        this.bindToEvents()
    }
    bindToEvents() {
        this.socket.on("enterWorld", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("enterWorld: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "enterWorld", payload: data.payload })
            }
        })
        this.socket.on("leaveWorld", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("leaveWorld: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "leaveWorld", payload: data.payload })
            }
        })
        this.socket.on("objMoved", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("objMoved: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "objMoved", payload: data.payload })
            }
        })
        this.socket.on("objectEnter", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("objectEnter: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "objectEnter", payload: data.payload })
            }
        })
        this.socket.on("objectLeave", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("objectLeave: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "objectLeave", payload: data.payload })
            }
        })
    }
    login(token) {
        if (this.socket !== null) {
            this.socket.emit("login", token)
        }
    }
    eventOccured(event) {
        if (this.socket !== null) {
            switch (event.type) {
            case "userObjMoved":
                this.socket.emit("userObjMoved", event)
                break
            default:
                break
            }
        }
    }
}
