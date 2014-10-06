# ajax-storage

[![Build Status][travis-img]][travis]

`localStorage` and `sessionStorage` caching seamlessly built onto jQuery Ajax HTTP requests. For the browser.

* [@nfreear/ajax-storage][]


## Usage

### Usage 1 - explicit:

```js
    $.ajax_storage('http://...');
```

### Usage 2 - implicit

```js
    $.ajax({
      storage: true,
      url: 'http://...'
    });
```

### Usage 3 - options, deferreds:

```js
    $.ajax_storage({
      storage_max_age: 20 * 60 * 1000,
      url: 'http://...'
    })
    .done(function (data) {
      // Do something with the data...
    })
    .fail(function () {
      // Handle an error...
    });
```

### Usage 4 - global:

```html
    <script src="jquery.js">
    <script>
    $.ajaxPrefilter(function (options, ...) {
      options.storage = true;
      options: storage_max_age = 20 * 60 * 1000;
    });

    <script src="ajax-storage.js">

    <script>
    $.get('http://...');
```

## License

©2014 [Nick Freear][]. License: [MIT][]


[@nfreear/ajax-storage]: https://github.com/nfreear/ajax-storage
[Nick Freear]:  http://twitter.com/nfreear
[MIT]:  http://nfreear.mit-license.org/
[travis]: https://travis-ci.org/nfreear/ajax-storage
[travis-img]: https://travis-ci.org/nfreear/ajax-storage.svg?branch=master "Build status"
