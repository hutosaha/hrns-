const app = module.exports = {};

app.isAdmin = (id, arr) => {

  return arr.indexOf(id) != -1;

};
