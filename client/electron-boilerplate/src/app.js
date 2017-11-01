// Here is the starting point for your application code.

// Small helpers you might want to keep
import "./helpers/context_menu.js"
import "./helpers/external_links.js"

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from "electron"
import jetpack from "fs-jetpack"
import { greet } from "./hello_world/hello_world"
import { Space } from "./engine/space"
import { Renderer } from "./render/render"
import { UserInput } from "./control/UserInput"
import { GameEngine } from "./engine/GameEngine"
import env from "./env"

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

const currentSpace = new Space(15, 15)
const userObj = {
    position: { x: 1, y: 3 },
    id: 115,
    drawMyself: (ctx, rect) => {
        ctx.fillStyle = "#FF0000"
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        ctx.fillStyle = "black"
    },
    updatePosition: (x, y) => {
        this.position.x = x
        this.position.y = y
    },
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
function go(obj, gameEngine) {
    const x = obj.position.x + getRandomInt(-1, 2)
    const y = obj.position.y + getRandomInt(-1, 2)
    gameEngine.onObjectUpdated(obj.id, "pos", { position: { x, y } })
    setTimeout(() => { go(obj, gameEngine) }, getRandomInt(100, 1500))
}
const userObj12 = {
    engine: undefined,
    position: { x: 5, y: 4 },
    id: 110,
    drawMyself: (ctx, rect) => {
        ctx.fillStyle = "#00FF00"
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        ctx.fillStyle = "black"
    },
    go: () => {

    },
    start: () => {
        go()
    },
}
const userObj13 = {
    engine: undefined,
    position: { x: 5, y: 8 },
    id: 113,
    drawMyself: (ctx, rect) => {
        ctx.fillStyle = "#00FF00"
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        ctx.fillStyle = "black"
    },
    go: () => {

    },
    start: () => {
        go()
    },
}
const userObj15 = {
    engine: undefined,
    position: { x: 7, y: 9 },
    id: 150,
    drawMyself: (ctx, rect) => {
        ctx.fillStyle = "#00FF00"
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        ctx.fillStyle = "black"
    },
    go: () => {

    },
    start: () => {
        go()
    },
}
const userObj16 = {
    engine: undefined,
    position: { x: 10, y: 4 },
    id: 170,
    drawMyself: (ctx, rect) => {
        ctx.fillStyle = "#00FF00"
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
        ctx.fillStyle = "black"
    },
    go: () => {

    },
    start: () => {
        go()
    },
}
currentSpace.addObject(userObj)
currentSpace.addObject(userObj12)
currentSpace.addObject(userObj13)
currentSpace.addObject(userObj15)
currentSpace.addObject(userObj16)
const canvas = document.getElementById("render")
const ctx = canvas.getContext("2d")
const render = new Renderer(ctx, currentSpace)

const gameEngine = new GameEngine(userObj, currentSpace, render)
const userInput = new UserInput(window, gameEngine)
userInput.start(userObj)
go(userObj12, gameEngine)
go(userObj13, gameEngine)
go(userObj15, gameEngine)
go(userObj16, gameEngine)
gameEngine.start()
