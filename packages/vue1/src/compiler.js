import Watcher from "./watcher.js";
import { getValueFromVm } from "./utils.js";

export default class Compiler {
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.$vm = vm;

    this.compile(this.$el);
  }

  compile(el) {
    const { childNodes } = el;
    Array.from(childNodes).forEach(node => {
      if (this.isEle(node)) {
        this.compileEle(node);

        if (node.childNodes && node.childNodes.length) {
          this.compile(node);
        }
      }
      if (this.isInterpolation(node)) {
        this.compileText(node);
      }
    });
  }

  isEle(node) {
    return node.nodeType === 1;
  }

  compileEle(node) {
    Array.from(node.attributes).forEach(attr => {
      const name = attr.name;
      const exp = attr.value;
      if (this.isStartsWithV(name)) {
        const dir = name.slice(2);
        this[dir] && this[dir](node, exp);
      } else if (this.isEvent(name)) {
        const eventName = name.slice(1);
        this.registerEvent(node, exp, eventName);
      }
    });
  }

  text(node, exp) {
    this.update(node, exp, "text");
  }

  html(node, exp) {
    this.update(node, exp, "html");
  }

  model(node, exp) {
    this.update(node, exp, "model");

    node.addEventListener("input", el => {
      this.$vm[exp] = el.target.value;
    });
  }

  update(node, exp, action) {
    const fnName = `${action}Update`;
    const fn = this[fnName];
    // init
    const value = getValueFromVm(this.$vm, exp);
    fn && fn(node, value);

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

  modelUpdate(node, val) {
    node.value = val;
  }

  isStartsWithV(str) {
    return str.startsWith("v-");
  }

  isEvent(str) {
    return str.startsWith("@");
  }

  registerEvent(node, exp, event) {
    const fn = this.$vm[exp];
    fn && node.addEventListener(event, fn.bind(this.$vm));
  }

  isInterpolation(node) {
    return node.nodeType === 3 && /^\{\{(.*)\}\}$/.test(node.textContent);
  }

  compileText(node) {
    this.update(node, RegExp.$1, "text");
  }
}
