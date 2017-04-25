'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
        Author: SpringHack - springhack@live.cn
        Last modified: 2017-04-25 13:34:12
        Filename: es6.js
        Description: Created by SpringHack using vim automatically.
**/

/*
 * 除非明确调用clean方法否则timeBaseQueue中的缓存不会清除，建议直接setAutoClean(true)
 */

var Node = function () {
  function Node(value) {
    _classCallCheck(this, Node);

    this.value = null;
    this.next = null;

    this.value = value;
  }

  _createClass(Node, [{
    key: 'setNext',
    value: function setNext(next) {
      this.next = next;
    }
  }, {
    key: 'getNext',
    value: function getNext() {
      return this.next;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value = value;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.value;
    }
  }]);

  return Node;
}();

var List = function () {
  function List() {
    _classCallCheck(this, List);

    this.head = null;
    this.tail = null;

    this.head = null;
    this.tail = null;
  }

  _createClass(List, [{
    key: 'getHead',
    value: function getHead() {
      return this.head;
    }
  }, {
    key: 'getTail',
    value: function getTail() {
      return this.tail;
    }
  }, {
    key: 'moveAfter',
    value: function moveAfter() {
      this.head = this.head.getNext();
      if (this.head === null) {
        this.tail = null;
      }
    }
  }, {
    key: 'pushBack',
    value: function pushBack(value) {
      if (!this.head && !this.tail) {
        this.head = new Node(value);
        this.tail = this.head;
      } else {
        this.tail.setNext(new Node(value));
        this.tail = this.tail.getNext();
      }
    }
  }]);

  return List;
}();

var Cache = function () {
  _createClass(Cache, null, [{
    key: 'getInstance',
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
    key: 'setInstance',
    value: function setInstance(instance) {
      Cache.instance = instance;
    }
  }]);

  function Cache() {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
    var autoCleanInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var autoClean = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var debug = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, Cache);

    this.timer = null;
    this.debug = false;
    this.timeout = 0;
    this.interval = 0;
    this.instance = null;
    this.autoClean = false;
    this.checkQueue = {};
    this.timeBaseList = new List();

    this.timeout = 20;
    this.debug = debug;
    this.interval = autoCleanInterval;
    this.info('\u7F13\u5B58\u5F00\u542F\uFF0C\u8D85\u65F6\u8BBE\u7F6E: ' + this.timeout + '\uFF0C\u68C0\u6D4B\u95F4\u9694: ' + this.interval);
    this.setAutoClean(autoClean);
  }

  _createClass(Cache, [{
    key: 'fetch',
    value: function fetch(key) {
      if (this.checkQueue[key]) {
        var time = new Date().getTime();
        if (time - this.checkQueue[key].time > this.timeout * 1000) {
          delete this.checkQueue[key];
          this.info(key + ' \u7F13\u5B58\u5DF2\u7ECF\u8FC7\u671F\uFF0C\u6267\u884C\u79FB\u9664');
          return null;
        }
        this.info(key + ' \u7F13\u5B58\u672A\u8FC7\u671F\uFF0C\u53D6\u5F97\u503C');
        return this.checkQueue[key].value;
      }
      this.info('啥？是不是早就过期了？还是压根就没存？');
      return null;
    }
  }, {
    key: 'append',
    value: function append(key) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var time = new Date().getTime();
      if (this.checkQueue[key]) {
        this.checkQueue[key].time = time;
        this.checkQueue[key].value = value;
        this.info('\u66F4\u65B0 ' + key + ' \u7F13\u5B58');
      } else {
        this.checkQueue[key] = {
          key: key,
          time: time,
          value: value
        };
        this.timeBaseList.pushBack(this.checkQueue[key]);
        this.info('\u65B0\u5EFA ' + key + ' \u7F13\u5B58');
      }
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      delete this.checkQueue[key];
      this.info('\u79FB\u9664 ' + key + ' \u7F13\u5B58');
    }
  }, {
    key: 'clean',
    value: function clean() {
      var time = new Date().getTime();
      while (this.timeBaseList.getHead() && time - this.timeBaseList.getHead().getValue().time > this.timeout * 1000) {
        var entry = this.timeBaseList.getHead().getValue();
        this.info(entry.key + ' \u7F13\u5B58\u8FC7\u671F\uFF0C\u6267\u884C\u79FB\u9664');
        this.timeBaseList.moveAfter();
        delete this.checkQueue[entry.key];
      }
    }
  }, {
    key: 'info',
    value: function info(_info) {
      /* eslint-disable */
      this.debug && console.log(new Date().toString() + ' ' + _info);
      /* eslint-enable */
    }
  }, {
    key: 'setDebug',
    value: function setDebug(debug) {
      this.debug = debug;
    }
  }, {
    key: 'setAutoClean',
    value: function setAutoClean() {
      var _this = this;

      var auto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (auto !== this.autoClean) {
        if (auto && !this.timer) {
          this.timer = setInterval(function () {
            return _this.clean();
          }, this.interval * 1000);
          this.info('开启自动移除');
        }
        if (!auto && this.timer) {
          this.info('关闭自动移除');
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

