const dbObject = require("../includes/includes.js");

exports.cluster-h3 = (request, response) => {
  let today_date = dateNow();
  if(request.query.today_date)
    today_date = request.query.today_date;
    //return response.status(500).send({responseCode : 0, responseMessage : "Sorry, unable to find today_date", responseData : [] });

  dbObject.query("SELECT COUNT(OrderId) AS NoOfOrders FROM orders AS O WHERE O.OrderDate = ? ",[today_date], (errorMessage, responseData) => {
    if (errorMessage) 
      return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to fetch orders - "+today_date, responseData : errorMessage });
    
    //dbObject.release();
    return response.send({responseCode : 1, responseMessage : "Record fetch successfull - "+today_date, responseData : responseData });
  });
};

function dateNow() 
{
    let dateObject = new Date();
    let yearNow    = dateObject.getFullYear();
    let monthNow   = '' + (dateObject.getMonth() + 1);
    let dayNow     = '' + dateObject.getDate();
    
    if (monthNow.length < 2) 
      monthNow = '0' + monthNow;
    if (dayNow.length < 2) 
      dayNow = '0' + dayNow;

    return [yearNow,monthNow,dayNow].join('-');
}





