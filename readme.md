# skyfetch

es6 + rollup + skypack + jsdelivr + unpkg + wzrd.in

fetch an npm module from various CDNs to a single es6-ready file

## example

```sh
$ npm install -g skyfetch
...
$ skyfetch tinygradient
Fetching npm module from skypack: tinygradient
https://cdn.skypack.dev/tinygradient
https://cdn.skypack.dev/-/tinygradient@v1.1.2-tKse5ssJIN1EsUBizhu4/dist=es2020/tinygradient.js
https://cdn.skypack.dev/-/tinycolor2@v1.4.2-8O9xytlYPDVDOmLgvNpU/dist=es2020/tinycolor2.js
Finished. Output file: tinygradient.js
```

Then simply import it:

`index.html`:

```html
<script type="module">

import gradient from './tinygradient.js'

document.body.style.background = gradient('red', 'green', 'blue').css()

</script>
```

That's it, no bundlers to install, no complicated configurations.
Just an html file and you're ready to start working.

### credits

Thanks to these awesome projects:

- [Skypack](https://www.skypack.dev/)
- [jsDelivr](https://www.jsdelivr.com/)
- [UNPKG](http://unpkg.com/)
- [wzrd.in](https://wzrd.in/)
- [browserify](http://browserify.org/)
- [rollup](https://rollupjs.org/)
- [rollup-plugin-cjs-es](https://github.com/eight04/rollup-plugin-cjs-es)
- [rollup-plugin-skypack](https://github.com/yj01jung/rollup-plugin-skypack)
- [rollup-plugin-url-resolve](https://github.com/mjackson/rollup-plugin-url-resolve)

### License MIT
