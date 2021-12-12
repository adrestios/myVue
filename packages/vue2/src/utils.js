export const getValueFromVm = (vm, exp) => {
  const propArr = exp.split(".");
  if ([propArr[0], propArr[propArr.length - 1]].includes("")) {
    throw Error("插值表达式属性错误");
  }
  return propArr.reduce((acc, cur, idx) => {
    const val = acc[cur];
    if (val) {
      return val;
    } else {
      throw Error(`属性${cur}不存在`);
    }
  }, vm);
};
