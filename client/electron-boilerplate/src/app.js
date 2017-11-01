// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import { greet } from './hello_world/hello_world';
import {Space} from './engine/space'
import {Renderer} from './render/render'
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

let currentSpace = new Space(50,50)
currentSpace.addObject({position:{x:1,y:3},id:115,drawMyself:(ctx,rect)=>{
   ctx.fillStyle="#FF0000";
   ctx.fillRect(rect.x,rect.y,rect.width,rect.height)
   ctx.fillStyle="black"
  }})
let canvas = document.getElementById('render');
let ctx = canvas.getContext('2d');
let render = new Renderer(ctx,currentSpace)
render.onRenderUpdate()
