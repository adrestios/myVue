import Dep from "./dep.js";

export default class Watcher {
  constructor(vm, key, cb) {
    this.$vm = vm;
    this.$key = key;
    this.$cb = cb;

    Dep.target = this;
    this.$vm[key]
    Dep.target= null;
  }

  update() {
    this.$cb.call(this.$vm, this.$vm[this.$key]);
  }
}
