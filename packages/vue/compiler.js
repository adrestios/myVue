export default class Compiler {
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.$vm = vm;

    this.compile(this.$el)
  }

  
  compile(el) {
    const { childNodes } = el;
    Array.from(childNodes).forEach(node => {
      if(this.isEle(node)) {
        this.compileEle(node)

        if(node.childNodes && node.childNodes.length) {
          this.compile(node)
        }
      }
      if(this.isInterpolation(node)) {
        this.compileText(node)
      }

    })
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

        this[dir] && this[dir](node, exp);
      }
    })
  }

  text(node, exp) {
    node.textContent = this.$vm[exp];
  }

  html(node, exp) {
    node.innerHTML = this.$vm[exp];
  }

  isStartsWithV(str) {
    return str.startsWith('v-')
  }

  isInterpolation(node) {
    return node.nodeType === 3 && /^\{\{(.*)\}\}$/.test(node.textContent);
  }

  compileText(node) {
    node.textContent = this.$vm[RegExp.$1]
  }
}
