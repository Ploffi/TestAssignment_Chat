# Chat test assignment
## About
This repository contains the realisation of test assignments. It contains chat widget.  
Requirements:
1. There can be a large number of messages of various lengths (> 100 000)
2. Messages must be fetched from the mock server
3. Infinity scroll with on-the-fly loading
4. Virtualization of chat content
5. Write your own mock API server

[Live stand](http://51.250.93.153/)

## Start up
```bash
npm ci
node ./server & npm run dev
```

## Technologies
| Name                    | Usage                     | Why I chose it                                                                                                      |
|-------------------------|:--------------------------|---------------------------------------------------------------------------------------------------------------------|
| React                   | client rendering          | This is the main choice for the company i applied for and also de-facto standard of industry                        |
| Typescript              | typings                   | Unfortunately, the only survivor by [state of js](https://2022.stateofjs.com/en-US/other-tools/#javascript_flavors) |
| Vite                    | Compiling & bundling code | Basic set up is completely sufficient for the purposes of this assignment                                           |
| Css modules via PostCSS | write css                 | The easiest way to write native css and rich PostCSS plugins system for standard operations like autoprefix         |
| API server              | Fastify                   | East to set up and have all that I need out the box                                                                 |


## Algorithm of virtualization
[Documentation of VirtualizeList component](./src/components/VirtualizeList/docs.md)