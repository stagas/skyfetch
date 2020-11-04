#!/usr/bin/env node
const rollup = require('rollup')
const resolve = require('rollup-plugin-url-resolve')
const commonjs = require('rollup-plugin-cjs-es')
wrap(require('http'))
wrap(require('https'))
function wrap (http) {
  const fn = http.request
  http.request = function (req, ...args) {
    console.log(req.href)
    return fn.call(this, req, ...args)
  }
}
const input = '__bundle__.js'
const args = process.argv.slice(2).filter(x => x[0] === '-')
const opts = Object.fromEntries(args.map(x => [x, true]))
const mod = process.argv.slice(2).filter(x => x[0] !== '-').pop()

if (!mod || mod === '--help' || mod === '-h' || opts['--help'] || opts['-h']) {
  console.log(
`\
usage: jsfetch [opts] <npm-module-name>

options:
 -o, --output <file>    Output filename (default: <npm-module-name>.js)
 -f, --format <format>  Rollup output format (amd, cjs, es, iife, umd, system) (default: es)
 -s, --source <source>  CDN source to use (skypack, jsdelivr, unpkg, wzrd) (default: skypack)
`
  )
  process.exit(0)
  return
}

let format = 'es'
let source = 'skypack'

// remove artifacts to get a clean filename
let file = mod
if (mod[0] === '@') file = mod.split('/')[1]
file = file.split('?')[0]
file = file.split('/')[0]
file += '.js'

for (const arg of args) {
  switch (arg) {
    case '--format':
    case '-f':
      format = process.argv[process.argv.indexOf(arg)+1]
      break
    case '--source':
    case '-s':
      source = process.argv[process.argv.indexOf(arg)+1]
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

const cjs = commonjs({
  nested: true,
  cache: false,
  exportType: 'default'
})

let plugins = []

let banner = ''
let footer = ''

let url
let src

if (source === 'skypack') {
  url = 'https://cdn.skypack.dev/' + mod
  src = `
    export * from '${url}'
    export { default } from '${url}'
  `
}
else if (source === 'jsdelivr') {
  url = 'https://cdn.jsdelivr.net/npm/' + mod
  src = `module.exports = require('${url}')`
  plugins = [cjs]
  // outputExports = 'named'
}
else if (source === 'unpkg') {
  url = 'https://unpkg.com/' + mod
  if (mod.endsWith('?module')) {
    src = `export * from '${url}'`
  } else {
    src = `module.exports = require('${url}')`
    plugins = [cjs]
  }
}
else if (source === 'wzrd') {
  url = 'https://wzrd.in/debug-standalone/' + mod
  src = `export * from '${url}'`
  banner = 'var module = { exports: {} }; var exports = module.exports;\n'
  footer = 'export default module.exports;\n'
  format = 'cjs'
}
else {
  console.error('error: Unrecognized source option "' + source + '".\n\
Try --help for a list of options.\nValid sources are: skypack, unpkg')
  process.exit(1)
  return
}

const jsfetch = {
  name: 'jsfetch',
  resolveId (source) {
    if (source === input) {
      return source
    }
    return null
  },
  load (id) {
    if (id === input) {
      return src
    }
    return null
  }
}

const inputOptions = {
  input,
  plugins: [jsfetch, ...plugins, resolve()],
}

const outputOptions = {
  file,
  format,
  banner,
  footer,
  name: mod,
}

async function build() {
  console.log(`Fetching npm module from ${source}:`, mod)
  try {
    const bundle = await rollup.rollup(inputOptions)
    await bundle.write(outputOptions)
    console.log('Finished. Output file:', file)
  } catch (error) {
    console.error(error)
    if (error.code === 'ENOENT') {
      console.error('error: Module could not be fetched. Perhaps try another source?')
    }
    process.exit(1)
  }
}

build()
