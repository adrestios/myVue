import Compiler from "./compiler.js";
import { observe } from './observe.js';

export default class Vue {
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
