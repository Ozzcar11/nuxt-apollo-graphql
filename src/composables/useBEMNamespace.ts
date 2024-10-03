function BEM(block: string, blockSuffix = "", element = "", modifier = "") {
  let cls = block;

  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }

  return cls;
}

export const useBEMNamespace = (blockValue: string) => {
  const block = (blockSuffix = "") => BEM(blockValue, blockSuffix);
  const element = (element?: string) => element ? BEM(blockValue, "", element) : "";
  const modifier = (modifier?: string) => modifier ? BEM(blockValue, "", "", modifier) : "";

  return {
    block,
    element,
    modifier,
  };
};
