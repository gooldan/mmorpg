import io from "socket.io-client"

export class ClientNetwork {
    constructor(gameEngine) {
        this.socket = null
        this.gameEngine = gameEngine
        this.logNet = true
    }
    connectToServer(ip, port) {
        this.socket = io(`http://${ip}:${port}/`, { forceNode: true })
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
        this.socket.on("playersDamaged", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("playersDamaged: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "playersDamaged", payload: data.payload })
            }
        })
        this.socket.on("playerLvlUp", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("playerLvlUp: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "playerLvlUp", payload: data.payload })
            }
        })
        this.socket.on("playerDead", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("playerDead: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "playerDead", payload: data.payload })
            }
        })
        this.socket.on("playerRespawn", (data) => {
            if (data.ret === "OK") {
                if (this.logNet) {
                    console.log("playerRespawn: ", data.payload)
                }
                this.gameEngine.onNetworkEvent({ type: "playerRespawn", payload: data.payload })
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
            case "userHit":
                this.socket.emit("userHit", event)
                break
            default:
                break
            }
        }
    }
}
