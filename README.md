# Runtime Cache

> A runtime cache class

> By SpringHack

```
import Cache from 'runtime-cache';

/*
 * constructor(timeout = 20, autoCleanInterval = 1, autoClean = false, debug = false) 
 * You can setup this params via getInstance()
 */
const cache = Cache.getInstance();
/*
 * Or you can do like this
 * const cache = new Cache();
 * Cache.setInstance(cache);
 */

cache.fetch('name'); //You will get null
cache.append('name', 'SpringHack');
cache.fetch('name') //You will get SpringHack and 20s later...
cache.fetch('name'); //Null you will also get
cache.remove('name'); //Remove name
cache.setDebug(true); //You will see info
cache.setAutoClean(true); //Auto clean start
cache.clean(); //Manual clean
```
