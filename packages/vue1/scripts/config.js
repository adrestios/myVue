const Path = require("path");

export default {
  input: Path.resolve(__dirname, "../src/index.js"),
  // input: "D:/code/myVue/packages/vue/src/index.js",
  //
  output: {
    file: Path.resolve(__dirname, "../dist/vue.js"),
    // file: "D:/code/myVue/packages/vue/dist/vue.js",
    format: "umd",
    name: "Vue"
  }
};
