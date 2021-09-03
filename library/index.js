module.exports = app => {
    const clusterH3 = require("./cluster-h3.js");
    app.get("/cluster-h3/",clusterH3.cluster-h3);
};
  