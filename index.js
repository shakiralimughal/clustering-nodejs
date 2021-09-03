const app            = require("express")();
const http           = require('http');
const PORT           = process.env.PORT || 3000;
const server         = http.createServer(app).listen(PORT);
const bodyParser     = require("body-parser");


app.use(bodyParser({limit : '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("dirName",__dirname);
  //res.sendfile(__dirname +'/index.html');
  res.json({responseCode : 0, responseMessage : "Sorry, No request type found", responseData : [] });
});

require("./library/index.js")(app);

