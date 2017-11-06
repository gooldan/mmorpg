// Here is the starting point for your application code.

// Small helpers you might want to keep
import "./helpers/context_menu.js"
import "./helpers/external_links.js"
import io from "socket.io-client"

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from "electron"
import jetpack from "fs-jetpack"
import { greet } from "./hello_world/hello_world"
import { Space } from "./engine/space"
import { Renderer } from "./render/render"
import { UserInput } from "./control/UserInput"
import { GameEngine } from "./engine/GameEngine"
import { BaseObject } from "./entity/BaseObject"
import { ClientNetwork } from "./network/Network"
import env from "./env"
import _ from "lodash"

const app = remote.app
const appDir = jetpack.cwd(app.getAppPath())

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json")

const osMap = {
    win32: "Windows",
    darwin: "macOS",
    linux: "Linux",
}

// const defaultDraw = (ctx, rect) => {
//     ctx.fillStyle = "#FF0000"
//     ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
//     ctx.fillStyle = "black"
// }
// const userObj = new BaseObject(115, 1, 3, defaultDraw)

// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min)) + min
// }
// function go(obj, gameEngine) {
//     const x = obj.position.x + getRandomInt(-1, 2)
//     const y = obj.position.y + getRandomInt(-1, 2)
//     gameEngine.onObjectUpdated(obj.id, "pos", { position: { x, y } })
//     setTimeout(() => { go(obj, gameEngine) }, getRandomInt(100, 1500))
// }


document.getElementById("conn").addEventListener("click", () => {
    const currentSpace = new Space(15, 15)
    const canvas = document.getElementById("render")
    const ctx = canvas.getContext("2d")
    const render = new Renderer(ctx, currentSpace)
    const gameEngine = new GameEngine(currentSpace, render)
    const userInput = new UserInput(window, gameEngine)
    const network = new ClientNetwork(gameEngine)
    gameEngine.setNetworkObject(network)
    gameEngine.setUserInput(userInput)
    const token = document.getElementById("token").value
    gameEngine.start(token)
    // const socket = io("http://127.0.0.1:8081/")
    // socket.emit("login", "db5ae68d56e2e82df8aef4b4fecb8efc774c6814e6d21bb1fce742a5e94fc966")
    // socket.on("loaded", (data) => {
    //     if (data.ret === "OK") {
    //         const { objects } = data
    //         _.map(objects, (obj) => {
    //             console.log(obj)
    //             const newObj = new BaseObject(obj.id, obj.position.x, obj.position.y, defaultDraw)
    //             objects.push(newObj)
    //             currentSpace.addObject(newObj)
    //         })
    //         gameEngine.onSpaceUpdated(currentSpace)
    //     }
    // })
})
