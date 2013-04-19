[![Build Status](https://secure.travis-ci.org/siovene/perfectjs.png)](http://travis-ci.org/siovene/perfectjs)

# Perfect.js #
**PERF** ormance
**E** valuating
**C** omparative
**T** esting

`Perfect` is a library that works in conjunction with
[Benchmarkjs](http://benchmarkjs.com/).


## Goals ##
`Perfect` helps you spot performance regressions in your code by running
benchmarks on multiple versions of your library.


## Usage ##
The minimal working code you need to use `Perfect` resembles this:

```javascript
var perfect = new Perfect();
	a: "lib/target_library_0.1.js",
	b: "lib/target_library_0.2.js"
});

perfect.add("some test", function() {
	target_library.some_function();
});

perfect.run();
```

As you can see, `Perfect` expects paths to two versions of the library you need
to test for performance regressions, and they go to properties `a` and `b`.


## The in-built UI ##
`Perfect` ships with a very simple UI. To enable it, pass the following option
to the constructor:

```javascript
	enable_ui: true
```

You will need an HTML file that includes the `Perfect` CSS file:

```html
<link rel="stylesheet" type="text/css" href="perfect-ui.min.css" />
```

and the following JavaScript files:

```html
<script src="perfect-libs.js"></script>
<script src="perfect-ui.js"></script>
<script src="perfect.js"></script>
```

Additionally, you need an element with `id="pefect"`. Please see the "simple"
example.


## QUnit compatibility layer ##
Because `Perfect` works by comparing two versions of your library, you may
recycle your `QUnit` unit tests as performance tests. Knowing that certain
unit tests run faster or slower across different versions of your library can
help you spot performance regressions, and you don't need to write a lot of
performance tests anew.

To reuse your `QUnit` unit tests, link `perfect-qunit.js` after
`perfect.js` in your HTML file.

You should first have some code like this:

```html
<script type="text/javascript">
	QUnit.initPerfect({
		name: 'My performance test',
		a: 'lib/target_library_0.1.js',
		b: 'lib/target_library_0.2.js'
	});
</script>
```

then you should include your unit tests JavaScript file, and, finally, do this:

```html
<script type="text/javascript">
	QUnit.runPerfect();
</script>
```

## Examples ##
Please see the `examples/` directory.


## Third party libraries ##
`Perfect` uses:
 * Benchmarkjs: http://benchmarkjs.com/
 * lodash: http://lodash.com/
 * LazyLoad: https://github.com/rgrove/lazyload/
 * Mediator: https://github.com/ajacksified/Mediator.js

They are deployed as part of `perfect-libs.js`.


## Contributing ##
Please remember to run `grunt lint` before submitting patches.


## Testing ##
`Perfect` ships with unit tests. Please run `npm install` to install
the required dependencies, install `phantomjs` using your distribution's
package manager, and then do:

```
phantomjs tests/phantomjs-index.js tests/index.html
```

or simply:

```
npm test
```

## Authors and contributors ##
Salvatore Iovene <salvatore.iovene@intel.com>
