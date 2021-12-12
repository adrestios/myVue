import Watcher from "./watcher.js";

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
      if (this.isStartsWithV(name)) {
        const dir = name.slice(2);
        const exp = attr.value;
        console.log(name, "---name");
        // this.update(node, exp, dir);
        this[dir] && this[dir](node, exp);
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
    console.log("mpdel");
    this.update(node, exp, "model");

    node.addEventListener("input", el => {
      this.$vm[exp] = el.target.value;
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

  modelUpdate(node, val) {
    node.value = val;
  }

  isStartsWithV(str) {
    return str.startsWith("v-");
  }

  isInterpolation(node) {
    return node.nodeType === 3 && /^\{\{(.*)\}\}$/.test(node.textContent);
  }

  compileText(node) {
    this.update(node, RegExp.$1, "text");
  }
}
