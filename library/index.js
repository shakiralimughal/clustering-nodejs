module.exports = app => {
    const clusterOrder = require("./clusterOrder.js");
    app.post("/clusterH3/",clusterOrder.clusterH3);
};
  