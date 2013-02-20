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
child elment. Here's an example:

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

## Examples ##
Please see the examples/ directory.


### Dependencies ###
Perfectjs needs:
 * Benchmarkjs: http://benchmarkjs.com/
 * Underscorejs: http://underscorejs.org/
 * LazyLoad: https://github.com/rgrove/lazyload/
 * jQuery: http://jquery.org/ (only if you want to use Perfect.UI)

Remember to include them before Perfectjs, in your HTML files.


### Authors and contributors ###
Salvatore Iovene <salvatore.iovene@intel.com>
