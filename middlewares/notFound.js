const notFound = async (req, res) => {
  res.status(404).json({ msg: "this route does not exist" });
};

module.exports = notFound;
