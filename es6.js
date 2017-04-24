/**
        Author: SpringHack - springhack@live.cn
        Last modified: 2017-04-24 23:39:55
        Filename: src/utils/runtimeCache.js
        Description: Created by SpringHack using vim automatically.
**/

/*
 * 除非明确调用clean方法否则timeBaseQueue中的缓存不会清除，建议直接setAutoClean(true)
 */

class Cache {
  static instance = null;
  timer = null;
  timeout = 0;
  interval = 0;
  instance = null;
  autoClean = false;
  checkQueue = {};
  timeBaseQueue = [];
  static getInstance(...rest) {
    if (!Cache.instance) {
      Cache.instance = new Cache(...rest);
    }
    return Cache.instance;
  }
  static setInstance(instance) {
    Cache.instance = instance;
  }
  constructor(timeout = 20, autoCleanInterval = 1, autoClean = false) {
    this.timeout = 20;
    this.interval = autoCleanInterval;
    /* eslint-disable */
    console.info(`${(new Date()).toString()} 缓存开启，超时设置: ${this.timeout}，检测间隔: ${this.interval}`);
    /* eslint-enable */
    this.setAutoClean(autoClean);
  }
  fetch(key) {
    if (this.checkQueue[key]) {
      const time = (new Date()).getTime();
      if (time - this.checkQueue[key].time > this.timeout * 1000) {
        delete this.checkQueue[key];
        /* eslint-disable */
        console.info(`${(new Date()).toString()} ${key} 缓存已经过期，执行移除`);
        /* eslint-enable */
        return null;
      }
      /* eslint-disable */
      console.info(`${(new Date()).toString()} ${key} 缓存未过期，取得值`);
      /* eslint-enable */
      return this.checkQueue[key].value;
    }
    /* eslint-disable */
    console.info(`${(new Date()).toString()} 啥？是不是早就过期了？还是压根就没存？`);
    /* eslint-enable */
    return null;
  }
  append(key, value = true) {
    const time = (new Date()).getTime();
    if (this.checkQueue[key]) {
      this.checkQueue[key].time = time;
      this.checkQueue[key].value = value;
      /* eslint-disable */
      console.info(`${(new Date()).toString()} 更新 ${key} 缓存`);
      /* eslint-enable */
    } else {
      this.checkQueue[key] = {
        key,
        time,
        value
      };
      this.timeBaseQueue.push(this.checkQueue[key]);
      /* eslint-disable */
      console.info(`${(new Date()).toString()} 新建 ${key} 缓存`);
      /* eslint-enable */
    }
  }
  remove(key) {
    delete this.checkQueue[key];
    /* eslint-disable */
    console.info(`${(new Date()).toString()} 移除 ${key} 缓存`);
    /* eslint-enable */
  }
  clean() {
    const time = (new Date()).getTime();
    this.timeBaseQueue = this.timeBaseQueue.filter((entry) => {
      if (time - entry.time > this.timeout * 1000) {
        /* eslint-disable */
        console.info(`${(new Date()).toString()} ${entry.key} 缓存过期，执行移除`);
        /* eslint-enable */
        delete this.checkQueue[entry.key];
        return false;
      }
      return true;
    });
  }
  setAutoClean(auto = true) {
    if (auto !== this.autoClean) {
      if (auto && !this.timer) {
        this.timer = setInterval(() => this.clean(), this.interval * 1000);
        /* eslint-disable */
        console.info(`${(new Date()).toString()} 开启自动移除`);
        /* eslint-enable */
      }
      if (!auto && this.timer) {
        /* eslint-disable */
        console.info(`${(new Date()).toString()} 关闭自动移除`);
        /* eslint-enable */
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
}

export default Cache;
