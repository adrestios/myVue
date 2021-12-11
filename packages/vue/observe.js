import Dep from "./dep.js";
import Watcher from "./watcher.js";

export function observe(param) {
  if (typeof param !== "object" || param === null) {
    return param;
  }

  return new Observer(param);
}

class Observer {
  constructor(obj) {
    this.value = obj;

    if (Array.isArray(obj)) {
      // todo
    } else {
      this.walk(obj);
    }
  }

  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineProperty(obj, key, obj[key]);
    });
  }
}

function defineProperty(obj, key, val) {
  observe(val);
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get: function() {
      console.log("get: key-" + key + "value-" + val);
      return val;
    },
    set: function(v) {
      if (v !== val) {
        console.log("set: key-" + key + "value-" + v);
        val = v;
      }
    }
  });
}
