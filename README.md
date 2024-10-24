## Huynh Hanh Web App
![license](https://img.shields.io/badge/license-MIT-blue.svg)

![preview](public/assets/images/minimal-free-preview.jpg)

## Tech stacks
  - Reactjs - core library
  - Vite - build tool
  - Zustand - state management
  - ReactQuery - data fetching
  - Electron to build desktop app
  - Typescript + Tailwindcss

## Quick start

- Clone the repo: `git clone https://github.com/huynhhanh-ms/HH.Webapp.git`
- Recommended: `Node.js v20.x`
- **Install:** `npm i` or `yarn install`
- **Start:** `npm run dev` or `yarn dev`
- **Build:** `npm run build` or `yarn build`
- Open browser: `http://localhost:3039`

- Electron: yarn electron

## License
Distributed under the [MIT](https://github.com/huynhhanh-ms/HH.Webapp/blob/main/LICENSE.md) license.

## My Note When I'm working on this project
> Some Configuration
- Change port -> update in nginx.conf file + vite.config + dockerfile and docker-compose file if you use docker compose right :D
- Setting cors origin withCredentials: true -> can not use * or anyOrigin, must be specific domain.

> Work with Electron
- Debug with electron: use config in .vscode/launch.json
- Build electron: yarn electron
- Electron have 2 process: main process and renderer process
- Main process: manage all renderer process, create window, handle ipcMain, ipcRenderer
- So we can use ipcMain to communicate between main process and renderer process
- create a ContextBridge to expose ipcRenderer to renderer process

- JS file type: use .mjs for ES6 module, .cjs for commonJS module
- type:'module" in package.json to use ES6 module
- use require() for commonJS module
- I push all code Main process in src/desktop folder all use cjs file type and require() to import module.

> Work with SERIAL PORT API
- use Web serial API (support only in chrome, edge...) 
- turn on flag in chrome://flags/#enable-experimental-web-platform-features 
- it not work in http, must use https (or allow insecure localhost for development purpose)
