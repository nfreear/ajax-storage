/*!
ajax-storage Javascript, version 0.0.1.

@copyright	Nick Freear, 25 September 2014.
@link		https://github.com/nfreear/ajax-storage
*/

/*if (typeof require !== 'undefined') {  // Node.js
  var jQuery = require('jquery');
}*/


//;
(function($) {

  'use strict';

  var store_type, store_prefix, store_max_age,
    my_log, g_jqXHR, dfd = $.Deferred();

  // multiple plugins can go here
  (function (pluginName) {
    var defaults = {
      // Accepts all `jQuery.ajax()` settings, except `beforeSend`.
      // See, http://api.jquery.com/jQuery.ajax/
      /* async:   true,
      ... */

      // Storage
      store_type:   'sessionStorage',
      store_prefix: pluginName,
      store_max_age:5 * 60 * 1000  //Milliseconds?

      /*// Callback functions.
      , log: function () { },
      success: function (data, textStatus, jqXHR) { },
      error: function (jqXHR, textStatus, errorThrown) { }
      */
    };

    $[pluginName] = function (url, options) {

      // If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		} else {
			options.url = url;
		}

      options = $.extend(true, {}, defaults, options);

      my_log = my_log || options.log || function () {};

      if (!options.url) {
        options.error && options.error(g_jqXHR, "error", "{url} is required!");

        return dfd.reject(g_jqXHR, "error", "{url} is required!");
      }

	  store_prefix = prefix(options);
	  store_type = options.store_type;
	  store_max_age = options.store_max_age;

      if (store_max_age) {
		options.data = getStorage();
	    if (options.data) {

	      g_jqXHR.ajaxStorage = {
	        fromStorage: true,
	        url: options.url
	      };

	      options.success && options.success(options.data, "success", g_jqXHR);

	      return dfd.resolve(options.data, "success", g_jqXHR);
        }
      }

      var ajax_options = options;

      ajax_options.log =
      ajax_options.store_type =
      ajax_options.store_prefix =
      ajax_options.store_max_age = null;
      /*ajax_options.beforeSend = function (jqXHR, settings) {
        g_jqXHR = jqXHR;

        my_log("beforeSend");
      };*/

      $.ajax(ajax_options)
      .done(function (data, stat, jqXHR) {
        // Too late to modify 'jqXHR'!

        setStorage(data, jqXHR);

	    return jqXHR;
      });

      return g_jqXHR;
    };
    $[pluginName].defaults = defaults;

  })('ajax_storage');


  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    g_jqXHR = jqXHR;
    if (options.log) { my_log = options.log; }

    my_log && my_log("ajaxPrefilter", arguments);
  });


  function prefix(opts) {
    return opts.store_prefix + '.' + padToHex(opts.url) + '.';
  }

  function padToHex(str, length) {
    length = length || 16;
    var hex = convertToHex(str);
	//TODO:
    return hex;
  }

  //http://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex
  function convertToHex(str) {
    var hex = '', i;
    for (i = 0; i < str.length; i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  function t(s) { return s; }

  // Storage: http://html5demos.com/storage | http://diveintohtml5.info/storage.html
  function getStorage() {
    var
      dt = new Date(),
      value,
      storage = window[store_type],
      delta = 0;

    if (!store_type || !window[store_type]) { return; }

    value = storage.getItem(store_prefix + 'data');

    if (value) {
      delta = (dt.getTime() - dt.setTime(storage.getItem(store_prefix + 'timestamp'))) / 1000;
      if (store_max_age && store_max_age > 0 && delta > store_max_age) {
        my_log(store_type + ": " + t("stale, delta: %n", {"%n": delta}), store_max_age);
        value = false;
      } else {
        my_log(store_type + ": " + t("read data, last update: %ns ago", {"%n": delta})); //, value);
      }
    } else {
      my_log(store_type + ": " + t("empty"));
    }

    return value ? JSON.parse(value) : false;
  }

  function setStorage(data, jqXHR) {
    var
      dt = new Date(),
      storage = window[store_type];

    if (!store_type || !window[store_type]) { return; }

    storage.setItem(store_prefix + 'data', JSON.stringify(data));
    storage.setItem(store_prefix + 'timestamp', dt.getTime());
    storage.setItem(store_prefix + 'time', dt.toString());

    jqXHR.responseJSON = null;
    jqXHR.responseHeaders = jqXHR.getAllResponseHeaders(); // Empty for cross-origin requests!

    storage.setItem(store_prefix + 'jqXHR', JSON.stringify(jqXHR));

    my_log(store_type + ": " + t("save data"), data); //data
  }

})(jQuery);
