export default class Dep {
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
