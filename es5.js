"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
        Author: SpringHack - springhack@live.cn
        Last modified: 2017-04-24 23:39:55
        Filename: src/utils/runtimeCache.js
        Description: Created by SpringHack using vim automatically.
**/

/*
 * 除非明确调用clean方法否则timeBaseQueue中的缓存不会清除，建议直接setAutoClean(true)
 */

var Cache = function () {
  _createClass(Cache, null, [{
    key: "getInstance",
    value: function getInstance() {
      if (!Cache.instance) {
        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
          rest[_key] = arguments[_key];
        }

        Cache.instance = new (Function.prototype.bind.apply(Cache, [null].concat(rest)))();
      }
      return Cache.instance;
    }
  }, {
    key: "setInstance",
    value: function setInstance(instance) {
      Cache.instance = instance;
    }
  }]);

  function Cache() {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
    var autoCleanInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var autoClean = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, Cache);

    this.timer = null;
    this.timeout = 0;
    this.interval = 0;
    this.instance = null;
    this.autoClean = false;
    this.checkQueue = {};
    this.timeBaseQueue = [];

    this.timeout = 20;
    this.interval = autoCleanInterval;
    /* eslint-disable */
    console.info(new Date().toString() + " \u7F13\u5B58\u5F00\u542F\uFF0C\u8D85\u65F6\u8BBE\u7F6E: " + this.timeout + "\uFF0C\u68C0\u6D4B\u95F4\u9694: " + this.interval);
    /* eslint-enable */
    this.setAutoClean(autoClean);
  }

  _createClass(Cache, [{
    key: "fetch",
    value: function fetch(key) {
      if (this.checkQueue[key]) {
        var time = new Date().getTime();
        if (time - this.checkQueue[key].time > this.timeout * 1000) {
          delete this.checkQueue[key];
          /* eslint-disable */
          console.info(new Date().toString() + " " + key + " \u7F13\u5B58\u5DF2\u7ECF\u8FC7\u671F\uFF0C\u6267\u884C\u79FB\u9664");
          /* eslint-enable */
          return null;
        }
        /* eslint-disable */
        console.info(new Date().toString() + " " + key + " \u7F13\u5B58\u672A\u8FC7\u671F\uFF0C\u53D6\u5F97\u503C");
        /* eslint-enable */
        return this.checkQueue[key].value;
      }
      /* eslint-disable */
      console.info(new Date().toString() + " \u5565\uFF1F\u662F\u4E0D\u662F\u65E9\u5C31\u8FC7\u671F\u4E86\uFF1F\u8FD8\u662F\u538B\u6839\u5C31\u6CA1\u5B58\uFF1F");
      /* eslint-enable */
      return null;
    }
  }, {
    key: "append",
    value: function append(key) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var time = new Date().getTime();
      if (this.checkQueue[key]) {
        this.checkQueue[key].time = time;
        this.checkQueue[key].value = value;
        /* eslint-disable */
        console.info(new Date().toString() + " \u66F4\u65B0 " + key + " \u7F13\u5B58");
        /* eslint-enable */
      } else {
        this.checkQueue[key] = {
          key: key,
          time: time,
          value: value
        };
        this.timeBaseQueue.push(this.checkQueue[key]);
        /* eslint-disable */
        console.info(new Date().toString() + " \u65B0\u5EFA " + key + " \u7F13\u5B58");
        /* eslint-enable */
      }
    }
  }, {
    key: "remove",
    value: function remove(key) {
      delete this.checkQueue[key];
      /* eslint-disable */
      console.info(new Date().toString() + " \u79FB\u9664 " + key + " \u7F13\u5B58");
      /* eslint-enable */
    }
  }, {
    key: "clean",
    value: function clean() {
      var _this = this;

      var time = new Date().getTime();
      this.timeBaseQueue = this.timeBaseQueue.filter(function (entry) {
        if (time - entry.time > _this.timeout * 1000) {
          /* eslint-disable */
          console.info(new Date().toString() + " " + entry.key + " \u7F13\u5B58\u8FC7\u671F\uFF0C\u6267\u884C\u79FB\u9664");
          /* eslint-enable */
          delete _this.checkQueue[entry.key];
          return false;
        }
        return true;
      });
    }
  }, {
    key: "setAutoClean",
    value: function setAutoClean() {
      var _this2 = this;

      var auto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (auto !== this.autoClean) {
        if (auto && !this.timer) {
          this.timer = setInterval(function () {
            return _this2.clean();
          }, this.interval * 1000);
          /* eslint-disable */
          console.info(new Date().toString() + " \u5F00\u542F\u81EA\u52A8\u79FB\u9664");
          /* eslint-enable */
        }
        if (!auto && this.timer) {
          /* eslint-disable */
          console.info(new Date().toString() + " \u5173\u95ED\u81EA\u52A8\u79FB\u9664");
          /* eslint-enable */
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    }
  }]);

  return Cache;
}();

Cache.instance = null;
exports.default = Cache;

