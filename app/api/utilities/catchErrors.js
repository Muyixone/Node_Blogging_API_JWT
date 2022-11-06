const tryCatchError = (name) => {
  return (req, res, next) => {
    name(req, res, next).catch(next);
  };
};

module.exports = tryCatchError;
