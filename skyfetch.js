#!/usr/bin/env node
const rollup = require('rollup')
const Skypack = require('rollup-plugin-skypack/dist/SkypackResolver.js')
const resolve = require('rollup-plugin-url-resolve')
wrap(require('http'))
wrap(require('https'))
function wrap (http) {
  const fn = http.request
  http.request = function (req, ...args) {
    console.log(req.href)
    return fn.call(this, req, ...args)
  }
}
const bundleId = '__bundle__'
const args = process.argv.slice(2).filter(x => x[0] === '-')
const opts = Object.fromEntries(args.map(x => [x, true]))
const mod = process.argv.slice(2).filter(x => x[0] !== '-').pop()

if (!mod || mod === '--help' || mod === '-h' || opts['--help'] || opts['-h']) {
  console.log(
`\
usage: skyfetch [opts] <npm-module-name>

options:
 -o, --output <file>    Output filename (default: <npm-module-name>.js)
 -f, --format <format>  Rollup output format (amd, cjs, es, iife, umd, system) (default: es)
 -p, --pinned           Use skypack pinned url (minified) (default: no)\
`
  )
  process.exit(0)
  return
}

let optimize = false
let format = 'es'
let file = mod + '.js'
for (const arg of args) {
  switch (arg) {
    case '--pinned':
    case '-p':
      optimize = true
      break
    case '--format':
    case '-f':
      format = process.argv[process.argv.indexOf(arg)+1]
      break
    case '--output':
    case '--out':
    case '-o':
      file = process.argv[process.argv.indexOf(arg)+1]
      break
    default:
      console.error('error: Unrecognized option "' + arg + '".\nTry --help for a list of options.')
      process.exit(1)
      return
  }
}

const resolver = new Skypack.SkypackResolver({ optimize })

const skypack = {
  name: 'skypack',
  async resolveId (id) {
    if (id === mod) {
      const url = await resolver.resolve(id)
      return { id: url }
    }
  },
}

const skyfetch = {
  name: 'skyfetch',
  resolveId (source) {
    if (source === bundleId) {
      return source
    }
    return null
  },
  load (id) {
    if (id === bundleId) {
      return `
        export * from '${mod}'
        export { default } from '${mod}'
      `
    }
    return null
  }
}

const inputOptions = {
  input: '__bundle__',
  plugins: [
    skyfetch,
    skypack,
    resolve()
  ]
}

const outputOptions = {
  file,
  format,
  name: mod,
  exports: 'named'
}

async function build() {
  console.log('Fetching module from npm:', mod)
  const bundle = await rollup.rollup(inputOptions)
  await bundle.write(outputOptions)
  console.log('Finished. Output file:', file)
}

build()
