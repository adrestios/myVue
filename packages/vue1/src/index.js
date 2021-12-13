import Compiler from "./compiler.js";
import { observe } from "./observe.js";

export default class Vue {
  constructor(options) {
    this.$data = options.data;
    this.$methods = options.methods;
    this.$options = options;

    observe(this.$data);

    proxy(this);

    new Compiler(options.el, this);
  }
}

function proxy(vm) {
  // 代理data
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

  // 代理method
  Object.keys(vm.$methods).forEach(key => {
    if (vm[key]) {
      throw Error("方法名重名");
    }
    Object.defineProperty(vm, key, {
      get: function() {
        return vm.$methods[key];
      },
      set: function(v) {
        if (v !== vm.$methods[key]) {
          vm.$data[key] = v;
        }
      }
    });
  });
}
