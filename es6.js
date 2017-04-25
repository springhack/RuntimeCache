/**
        Author: SpringHack - springhack@live.cn
        Last modified: 2017-04-25 13:34:12
        Filename: es6.js
        Description: Created by SpringHack using vim automatically.
**/

/*
 * 除非明确调用clean方法否则timeBaseQueue中的缓存不会清除，建议直接setAutoClean(true)
 */

class Node {
  value = null;
  next = null;
  constructor(value) {
    this.value = value;
  }
  setNext(next) {
    this.next = next;
  }
  getNext() {
    return this.next;
  }
  setValue(value) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}

class List {
  head = null;
  tail = null;
  constructor() {
    this.head = null;
    this.tail = null;
  }
  getHead() {
    return this.head;
  }
  getTail() {
    return this.tail;
  }
  moveAfter() {
    this.head = this.head.getNext();
    if (this.head === null) {
      this.tail = null;
    }
  }
  pushBack(value) {
    if (!this.head && !this.tail) {
      this.head = new Node(value);
      this.tail = this.head;
    } else {
      this.tail.setNext(new Node(value));
      this.tail = this.tail.getNext();
    }
  }
}

class Cache {
  static instance = null;
  timer = null;
  debug = false;
  timeout = 0;
  interval = 0;
  instance = null;
  autoClean = false;
  checkQueue = {};
  timeBaseList = new List();
  static getInstance(...rest) {
    if (!Cache.instance) {
      Cache.instance = new Cache(...rest);
    }
    return Cache.instance;
  }
  static setInstance(instance) {
    Cache.instance = instance;
  }
  constructor(timeout = 20, autoCleanInterval = 1, autoClean = false, debug = false) {
    this.timeout = 20;
    this.debug = debug;
    this.interval = autoCleanInterval;
    this.info(`缓存开启，超时设置: ${this.timeout}，检测间隔: ${this.interval}`);
    this.setAutoClean(autoClean);
  }
  fetch(key) {
    if (this.checkQueue[key]) {
      const time = (new Date()).getTime();
      if (time - this.checkQueue[key].time > this.timeout * 1000) {
        delete this.checkQueue[key];
        this.info(`${key} 缓存已经过期，执行移除`);
        return null;
      }
      this.info(`${key} 缓存未过期，取得值`);
      return this.checkQueue[key].value;
    }
    this.info('啥？是不是早就过期了？还是压根就没存？');
    return null;
  }
  append(key, value = true) {
    const time = (new Date()).getTime();
    if (this.checkQueue[key]) {
      this.checkQueue[key].time = time;
      this.checkQueue[key].value = value;
      this.info(`更新 ${key} 缓存`);
    } else {
      this.checkQueue[key] = {
        key,
        time,
        value
      };
      this.timeBaseList.pushBack(this.checkQueue[key]);
      this.info(`新建 ${key} 缓存`);
    }
  }
  remove(key) {
    delete this.checkQueue[key];
    this.info(`移除 ${key} 缓存`);
  }
  clean() {
    const time = (new Date()).getTime();
    while (this.timeBaseList.getHead()
      && time - this.timeBaseList.getHead().getValue().time > this.timeout * 1000) {
      const entry = this.timeBaseList.getHead().getValue();
      this.info(`${entry.key} 缓存过期，执行移除`);
      this.timeBaseList.moveAfter();
      delete this.checkQueue[entry.key];
    }
  }
  info(info) {
    /* eslint-disable */
    this.debug && console.log(`${(new Date()).toString()} ${info}`);
    /* eslint-enable */
  }
  setDebug(debug) {
    this.debug = debug;
  }
  setAutoClean(auto = true) {
    if (auto !== this.autoClean) {
      if (auto && !this.timer) {
        this.timer = setInterval(() => this.clean(), this.interval * 1000);
        this.info('开启自动移除');
      }
      if (!auto && this.timer) {
        this.info('关闭自动移除');
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
}

export default Cache;
