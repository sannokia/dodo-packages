export default output => config => {
  return {
    ...config,
    output: {
      ...config.output,
      ...output
    }
  };
};
