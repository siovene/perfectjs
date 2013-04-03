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
var suite = new Benchmark.Suite(),
    perfect = new Perfect();

suite.add("some test", function() {
	target_library.some_function();
});

perfect.setOptions({
	name: "My performance test",
	a: "lib/target_library_0.1.js",
	b: "lib/target_library_0.2.js",
	suite: suite
});

perfect.run();
```

As you can see, `Perfect` expects paths to two versions of the library you need
to test for performance regressions, and they go to properties `a` and `b`.

This minimal example will make use of `Perfect.UI`, a simple component that
uses `jQuery` to append results to an `HTML` `<table>`.

Your `HTML` file needs to have a `<table>` with `id="perfect"` and a `<tbody>`
child element. Here's an example:

```html
<table id="perfect" border="1" cellpadding="10">
	<thead>
		<tr>
			<th>#</th>
			<th>Test</th>
			<th>Kilo ops/sec 'A'</th>
			<th>Kilo ops/sec 'B'</th>
			<th>Diff</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
```

Data will be appended to the `<tbody>` element.

## QUnit compatibility layer ##
Because `Perfectjs` works by comparing two versions of your library, you may
recycle your `QUnit` unit tests as performance tests. Knowing that certain
unit tests run faster or slower across different versions of your library can
help you spot performance regressions, and you don't need to write a lot of
performance tests anew.

To reuse your `QUnit` unit tests, link `perfect-qunit.js` after
`perfect.js` in your HTML file, then link your unit test javascript files,
and finally add the following code at the end of your `<body>`:

```html
<script type="text/javascript">
	QUnit.runPerfect({
		name: 'My performance test',
		a: 'lib/target_library_0.1.js',
		b: 'lib/target_library_0.2.js'
	});
</script>
```

## Examples ##
Please see the `examples/` directory.

## Dependencies ##
`Perfect` needs:
 * Benchmarkjs: http://benchmarkjs.com/
 * Underscorejs: http://underscorejs.org/
 * LazyLoad: https://github.com/rgrove/lazyload/
 * jQuery: http://jquery.org/ (only if you want to use Perfect.UI)

Remember to include them before `Perfect`, in your `HTML` files.

## Contributing ##
Please remember to run `grunt lint` before submitting patches.

## Testing ##
`Perfect` ships with unit tests. Please run `npm install` to install
the required dependencies, and then `node tests/server.js`.

Finally, point your browser to http://localhost:3000/tests/ .

## Authors and contributors ##
Salvatore Iovene <salvatore.iovene@intel.com>
