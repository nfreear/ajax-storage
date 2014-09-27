/*!
  BDD, Behaviour-driven development.
  @link http://chaijs.com/api/bdd/
  @link http://blog.revathskumar.com/2013/03/testing-jquery-ajax-with-mocha-and-sinon.html
*/
if (typeof require !== 'undefined') {
    var $ = require('jquery')
      , X_ajax_storage = require("../ajax-storage.js")
      , chai = require("chai");
}
chai.should();
var expect = chai.expect
  , URL = "data/test-json.js"
  , STORAGE_MAX_AGE = 5 * 60 * 1000
  ;

// var util = require("util");

before(function () {
  console.log("before");

  localStorage.clear();
  sessionStorage.clear();
});

after(function () {
  console.log("after");
});


describe("jQuery", function () {
  this.timeout(10000);
  it("and $ should exist and have a version number of '2.1.1'.", function (done) {
	console.log("jQuery version:", $.fn.jquery);

    expect(jQuery, "jQuery").to.be.a("function");
    expect($, "$").to.equal(jQuery);
    expect($.fn.jquery).to.equal("2.1.1");

    expect($.ajax, "$.ajax()").to.be.a("function");
    done();
  });
});


describe("$.ajax", function () {
  this.timeout(2000);
  it("should get JSON data via HTTP and expose it via 'done()'.", function (done) {
    var result = $.ajax({
      url: URL,
      dataType: "json"
    })
    .done(function (data) {
      console.log("$.ajax: done", arguments);

      expect(data.a, "$.ajax: data.a").to.be.a("string");
      done();
    })
    .fail(function (jqXHR, stat, ex) {
      console.log("$.ajax: fail", arguments);
      expect(stat, "$.ajax: fail").to.equal("success");
      done();
    });

  });
});


describe("$.ajaxStorage - HTTP", function () {
  this.timeout(2000);
  it("should get JSON data via HTTP, and indicate that HTTP is used.", function (done) {
    var result = $.ajax_storage({
      url: URL,
      dataType: "json",
      storageMaxAge: STORAGE_MAX_AGE,

      success: function (data, textStatus, jqXHR) {
        console.log("$.ajax_storage: success", arguments);

        expect(textStatus, "$.ajax_storage: status").to.equal("success");
        expect(data.a, "$.ajax_storage: data.a").to.be.a("string");
        expect(jqXHR, "$.ajax_storage: jqXHR").to.be.an("object");
        //expect(jqXHR.ajaxStorage.fromStorage, "jqXHR.ajaxStorage.fromStorage").to.equal( false );

        done();
      },
      error: function (jqXHR, stat, ex) {
        console.log("$.ajax_storage: error", arguments);
        expect(stat, "$.ajax: error").to.equal("success");
        done();
      }
    });

  });
});



describe("$.ajax_storage - storage", function () {
  this.timeout(2000);
  it("should get JSON data from `localStorage`, and indicate that storage is used.", function (done) {
    var result = $.ajax_storage({
      url: URL,
      dataType: "json",
      storage_max_age: STORAGE_MAX_AGE,

      success: function (data, textStatus, jqXHR) {
        console.log("$.ajax_storage: success", arguments);

        expect(textStatus, "$.ajax_storage: status").to.equal("success");
        expect(data.a, "$.ajax_storage: data.a").to.be.a("string");
        expect(jqXHR, "$.ajax_storage: jqXHR").to.be.an("object");
        expect(jqXHR.ajaxStorage.fromStorage,
            "jqXHR.ajaxStorage.fromStorage").to.equal( true );

        done();
      }
    });

  });
});



// ============================
// https://github.com/michael/github/blob/master/test/auth_test.js

var x_expect = chai.expect
  , TEST_USERNAME = "mikedeboertest"
  , TEST_PASSWORD = "test1324";

// var util = require("util");

describe("Auth", function(){
  this.timeout(10000);
  it("should authenticate with basic auth", function(done){
    var github = new Github({
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
      auth: "basic"
    });
    var user = github.getUser();
    user.repos(function(err, repos) {
      // console.error(util.inspect(err));
      expect(err).to.be.null;
      repos.should.be.ok;
      repos.length.should.be.above(1);
      done();

    });

  });
});
