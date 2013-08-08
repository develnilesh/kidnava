var data = { names: []}

// POST
// Adds a Name to the inmemory data 
exports.addName = function (req, res) {
  data.names.push(req.body);
  res.json(req.body);
};

// TODO: Add functionailty 
exports.deleteName = function (req, res) {
  res.json(true);
};
