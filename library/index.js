module.exports = app => {
    const clusterOrder = require("./clusterOrder.js");
    app.post("/clusterH3/",clusterOrder.clusterH3);
    app.post("/clusterKmeans/",clusterOrder.clusterKmeans);
};
  