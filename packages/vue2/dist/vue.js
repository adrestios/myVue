(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  class Dep {
    constructor() {
      this.deps = [];
    }

    addDeps(watcher) {
      this.deps.push(watcher);
    }

    notify() {
      this.deps.forEach(watcher => watcher.update());
    }
  }

  class Watcher {
    constructor(vm, key, cb) {
      this.$vm = vm;
      this.$key = key;
      this.$cb = cb;

      Dep.target = this;
      this.$vm[key];
      Dep.target= null;
    }

    update() {
      this.$cb.call(this.$vm, this.$vm[this.$key]);
    }
  }

  class Compiler {
    constructor(el, vm) {
      this.$el = document.querySelector(el);
      this.$vm = vm;

      this.compile(this.$el);
    }

    
    compile(el) {
      const { childNodes } = el;
      Array.from(childNodes).forEach(node => {
        if(this.isEle(node)) {
          this.compileEle(node);

          if(node.childNodes && node.childNodes.length) {
            this.compile(node);
          }
        }
        if(this.isInterpolation(node)) {
          this.compileText(node);
        }

      });
    }

    isEle(node) {
      return node.nodeType === 1
    }

    compileEle(node) {
      Array.from(node.attributes).forEach(attr => {
        const name = attr.name;
        if(this.isStartsWithV(name)) {
          const dir = name.slice(2);
          const exp = attr.value;

          this.update(node, exp, dir);
        }
      });
    }

    update(node, exp, action) {
      const fnName = `${action}Update`;
      const fn = this[fnName];
      // init
      fn && fn(node, this.$vm[exp]);

      // update
      new Watcher(this.$vm, exp, function(val) {
        fn && fn(node, val);
      });
    }

    textUpdate(node, val) {
      node.textContent = val;
    }

    htmlUpdate(node, val) {
      node.innerHTML = val;
    }

    isStartsWithV(str) {
      return str.startsWith('v-')
    }

    isInterpolation(node) {
      return node.nodeType === 3 && /^\{\{(.*)\}\}$/.test(node.textContent);
    }

    compileText(node) {
      this.update(node, RegExp.$1, 'text');
    }
  }

  function observe(param) {
    if (typeof param !== "object" || param === null) {
      return param;
    }

    return new Observer(param);
  }

  class Observer {
    constructor(obj) {
      this.value = obj;

      if (Array.isArray(obj)) ; else {
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
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      get: function() {
        console.log("get: key-" + key + "value-" + val);
        if(Dep.target) {
          dep.addDeps(Dep.target);
        }
        return val;
      },
      set: function(v) {
        if (v !== val) {
          console.log("set: key-" + key + "value-" + v);
          val = v;
          dep.notify();
        }
      }
    });
  }

  class Vue {
    constructor(options) {
      this.$data = options.data;
      this.$options = options;

      observe(this.$data);

      proxy(this);

      new Compiler(options.el, this);
    }
  }

  function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
      Object.defineProperty(vm, key, {
        get: function() {
          return vm.$data[key];
        },
        set: function(v) {
          if (v !== vm.$data[key]) {
            vm.$data[key] = v;
          }
        }
      });
    });
  }

  return Vue;

}));
//# sourceMappingURL=vue.js.map
