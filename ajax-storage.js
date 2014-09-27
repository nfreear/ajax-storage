/*!
ajax-storage Javascript, version 0.0.1.

@copyright	Nick Freear, 25 September 2014.
@link		https://github.com/nfreear/ajax-storage
@example

  $.ajax_storage({
    url: 'http://...',
    success: function (data) {
      // Do something with the data.
    }
  });


(  jQuery plugin template:
http://kolodny.github.io/blog/blog/2013/12/27/my-favorite-jquery-plugin-template
)
*/


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
      /*async:   true,
      url:     null,
      data:    null,
      dataType:'jsonp',
      jsonpCallback: null,
      headers: {},
      xhrFields: {},*/

      // Storage
      store_type:   'sessionStorage',
      store_prefix: pluginName,
      store_max_age:5 * 60 * 1000,  //Milliseconds?

      // Callback functions.
      log: function () {
        /*console.log(arguments);*/
      },
      success: function (data, textStatus, jqXHR) {
        /*my_log(pluginName, "Success", data);*/
      },
      error: function (jqXHR, textStatus, errorThrown) {
        /*my_log(pluginName, "ERROR", textStatus, errorThrown);*/
      }
    };

    $/*.fn*/[pluginName] = function (url, options) {

      // If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		} else {
			options.url = url;
		}

      options = $.extend(true, {}, defaults, options);

      my_log = options.log;

      if (!options.url) {
        options.error(null, "{url} is required!");

        return dfd.reject(null, "{url} is required!");
      }

	  store_prefix = prefix(options);
	  store_type = options.store_type;
	  store_max_age = options.store_max_age;

      if (store_max_age) {
		options.data = getStorage();
	    if (options.data) {
	      options.success(options.data, null, null);

	      return dfd.resolve(options.data, null, null);
        }
      }

      /*if (options.data) {
        return result;
      }*/

      var ajax_options = options;

      ajax_options.log =
      ajax_options.store_type =
      ajax_options.store_prefix =
      ajax_options.store_max_age = null;
      ajax_options.beforeSend = function (jqXHR, settings) {
        g_jqXHR = jqXHR;

        my_log("beforeSend");
      };

      $.ajax(ajax_options)
      /*$.ajax({
        url: options.url,
        dataType: options.dataType,
        data: options.data,
        async: options.async,
		headers: options.headers,
		xhrFields: options.xhrFields,
		jsonpCallback: options.jsonpCallback,
      })*/
      .done(function (data, stat, jqXHR) {
        var meta = jqXHR;
        meta.url = options.url;

        setStorage(data, meta);

	    options.success(data, stat, jqXHR);

	    return jqXHR;
	    //return dfd.resolve(data, stat, jqXHR);
      })
	  /*.fail(function (jqXHR, stat, errorThrown) {
	    options.error(jqXHR, stat, errorThrown);

	    return jqXHR;
	  })*/;


      return g_jqXHR;


      /*return this.each(function() {
        var elem = this,
          $elem = $(elem);

        // heres the guts of the plugin
          if (options.testFor(elem)) {
            $elem.css({
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: options.color
            });
          }
      });*/
    };
    $/*.fn*/[pluginName].defaults = defaults;

  })('ajax_storage');


  function prefix(opts) {
    return opts.store_prefix + '.' + padToHex(opts.url) + '.';
  }

  function padToHex(str, length) {
    length = length || 16;
    var hex = convertToHex(str);

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

    if (!store_type || !window[store_type]) return;

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

  function setStorage(data, meta) {
    var
      dt = new Date(),
      storage = window[store_type];

    if (!store_type || !window[store_type]) return;

    storage.setItem(store_prefix + 'data', JSON.stringify(data));
    storage.setItem(store_prefix + 'timestamp', dt.getTime());
    storage.setItem(store_prefix + 'time', dt.toString());

    meta.responseJSON = null;
	meta.responseHeaders = meta.getAllResponseHeaders(); // Empty for cross-origin requests!

    ///storage.setItem(store_prefix + 'status', status);
    storage.setItem(store_prefix + 'meta', JSON.stringify(meta));

    my_log(store_type + ": " + t("save data"), data); //data
  }

})(jQuery);
