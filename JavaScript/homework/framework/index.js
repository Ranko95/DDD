module.exports = (framework, transport, logger) => {
  return require(`./${framework}/${transport}`);
}
