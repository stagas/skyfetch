# skyfetch

rollup + skypack + fetch a module from npm to a single es6-ready file

## example

```sh
$ npm install -g skyfetch
...
$ skyfetch color
Fetching module from npm: color
https://cdn.skypack.dev/color
https://cdn.skypack.dev/-/color@v3.1.3-8J3bFTTZh374x6i2b68U/dist=es2020/color.js
https://cdn.skypack.dev/-/color-string@v1.5.4-XaLRvunsOYCGjR0MV9KP/dist=es2020/color-string.js
https://cdn.skypack.dev/new/color-convert@v1.9.3/dist=es2020?from=color
https://cdn.skypack.dev/-/color-convert@v1.9.3-L1YzLCs5oruHzanPK0Gb/dist=es2020/color-convert.js
https://cdn.skypack.dev/-/color-name@v1.1.4-7Qy8XzHj4NR72GYiRr2w/dist=es2020/color-name.js
https://cdn.skypack.dev/new/simple-swizzle@v0.2.2/dist=es2020?from=color-string
https://cdn.skypack.dev/-/color-name@v1.1.3-0yZtm6UiQGcbxcuUjGRq/dist=es2020/color-name.js
https://cdn.skypack.dev/-/simple-swizzle@v0.2.2-9tqHQ70Rg3WBBNEjKXxi/dist=es2020/simple-swizzle.js
https://cdn.skypack.dev/-/is-arrayish@v0.3.2-wwdCi9qjTEI0hc4Amkxb/dist=es2020/is-arrayish.js
Finished. Output file: color.js
```

Then simply import it:

`index.html`:

```html
<script type="module">
import Color from './color.js'
document.body.style.background = Color('#7743CE').alpha(.5).darken(.5).string()
</script>
```

That's it, no bundlers to install, no complicated configurations. Just an html file and you're ready to start working.

### credits

Thanks to these awesome projects:

- [Skypack.dev](https://www.skypack.dev/)
- [rollup](https://rollupjs.org/)
- [rollup-plugin-skypack](https://github.com/yj01jung/rollup-plugin-skypack)
- [rollup-plugin-url-resolve](https://github.com/mjackson/rollup-plugin-url-resolve)

### License MIT
