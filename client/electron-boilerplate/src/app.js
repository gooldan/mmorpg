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
import { Camera } from "./render/Camera"
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
function gameLoop(window, renderObj) {
    renderObj.onRenderUpdate()
    window.requestAnimationFrame(() => { gameLoop(window, renderObj) })
}
function startProcess(tokenIn) {
    document.getElementById("conn").hidden = true
    document.getElementById("conn1").hidden = true
    document.getElementById("conn2").hidden = true
    const currentSpace = new Space(15, 15)
    const canvas = document.getElementById("render")
    const ctx = canvas.getContext("2d")
    const camera = new Camera(7, 7, { x: 3, y: 3 }, currentSpace)
    const render = new Renderer(window, ctx, currentSpace, camera)
    const gameEngine = new GameEngine(currentSpace, render)
    const userInput = new UserInput(window, gameEngine)
    const network = new ClientNetwork(gameEngine)
    gameEngine.setNetworkObject(network)
    gameEngine.setUserInput(userInput)

    let token = document.getElementById("token").value
    if (tokenIn !== undefined) {
        token = tokenIn
    }
    gameEngine.start(token)
    gameLoop(window, render)
}
document.getElementById("conn").addEventListener("click", startProcess)
document.getElementById("conn1").addEventListener("click", () => { startProcess("e4a118916d950f433d65d942abde61603aa8d177bfbeb6bf72ee1b5f304c36a4") })
document.getElementById("conn2").addEventListener("click", () => { startProcess("db5ae68d56e2e82df8aef4b4fecb8efc774c6814e6d21bb1fce742a5e94fc966") })
