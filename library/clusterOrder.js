//const dbObject       = require("../includes/includes.js");
const uberH3             = require("h3-js");
const kMeans             = require("node-kmeans");
const { callbackify } = require("util");

exports.clusterH3 = (request, response) => {
  let parameters      = request.body;
  let factors         = parameters.factors;
  let order           = parameters.order;
  let vehicle         = parameters.vehicle;

  if(factors == undefined || order == undefined || vehicle == undefined)
    return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find paramters" });
  
  if(factors.drops == undefined || factors.weight == undefined || factors.vol == undefined)
    return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find paramters" });
  
  if(order.length <= 0)
    return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find orders" });
  
  //if(vehicle.length <= 0)
    //return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find vehicles" });


  //let factorTolerance  = 2;
  let factorWeight       = factors.weight;
  let factorDrops        = factors.drops;
  let factorArrayWeight  = rangCalculate(factorWeight-5,factorWeight+5)
  let factorArrayDrop    = rangCalculate(factorDrops-5,factorDrops+5)

  let h3Resolution = 15;

  let result = h3Clustering(order,h3Resolution);
  console.log("result.orderList",result.orderList);
  console.log("result.h3IndexCenter",result.h3IndexCenter);
  
  // let orderLatLng  = [];
  // let orderList    = [];

 


  // kMeans.clusterize(orderLatLng, {k: 1}, (erroMessage,responseCluster) => {
  //     if(erroMessage) 
  //       console.error("kmeans ERROR",erroMessage);
  //     else
  //     {
  //       let clusterCentroid = responseCluster[0].centroid;
  //       let h3Index = uberH3.geoToH3(clusterCentroid[0],clusterCentroid[1],h3Resolution);
  //       //console.log("h3Index",h3Index);
  //       //console.log("orderList[h3Index]",orderList[h3Index]);
  //       //console.log("---------------------");
  //       let orderArray = [];
  //       let weightPercentage = 0;
  //       let factorArray = {"drop" : 0, "weight" : 0};
  //       let nn =0;
  //       do {
  //         while(orderList[h3Index] != "undefined")
  //           h3Index = uberH3.h3ToParent(h3Index,h3Resolution); 
  //         console.log("h3Index",h3Index);
  //         console.log("orderList[h3Index]",orderList[h3Index]);
  //         // factorArray.drop   += 1;
  //         // factorArray.weight += orderList[h3Index].weight;
  //         // weightPercentage = parseInt((factorArray.weight/900)*100);
  //         // orderArray.push(orderList[h3Index]);
  //         // console.log("weightPercentage",weightPercentage);
  //         // console.log("factorArray.weight",factorArray.weight);
  //         // console.log("factorArray.drop",factorArray.drop);
  //         //console.log("orderList[h3Index]",orderList[h3Index]);
  //         //console.log("---------------------");
  //         nn++;
  //       }
  //       while(nn > 10);
  //       //factorArrayWeight.indexOf(weightPercentage) > -1 && factorArrayDrop.indexOf(factorArray.drop) > -1 
  //       console.log("orderArray",orderArray);
  //       console.log("-----------------------");
        
        
  //       //console.log("h3Index",h3Index);
  //       // while(orderList[h3Index] != "undefined")
  //       // {
  //       //   console.log("h3Index",h3Index);
  //       //   console.log("orderList[h3Index]",orderList[h3Index]);
  //       //   h3Index = uberH3.h3ToParent(h3Index,h3Resolution);
  //       //   console.log("h3Index PARENTS",h3Index);
  //       // }
          

  //       // for (const [keyName,valueName] of Object.entries(orderList[h3Index])) {
  //       //     console.log(keyName,valueName);
  //       // };
  //     }
      //return response.status(200).json({responseCode : 1, responseMessage : "Clustering successfully", responseData : responseCluster[0] })
 // });

  return response.status(500).send({responseCode : 0, responseMessage : "Clustering successfully", responseData : [] });

};

function h3Clustering(orderInput = [],h3Resolution = 15 )
{
  let h3Index         = "";
  let orderLatLng     = [];
  let orderList       = {};
  let h3IndexCenter   = "";
  for (let i = 0 ; i < orderInput.length ; i++) {
    orderLatLng.push([orderInput[i].lat,orderInput[i].lng]);
    h3Index = uberH3.geoToH3(orderInput[i].lat,orderInput[i].lng,h3Resolution);
    if(orderList[h3Index])
      orderList[h3Index].push(orderInput[i]);
    else 
      orderList[h3Index] = [orderInput[i]];
  }
  return ({"orderList" : orderList, "h3IndexCenter" : kmeans_cluster(orderLatLng,h3Resolution) });
}

function kmeans_cluster(orderLatLng,h3Resolution)
{
  kMeans.clusterize(orderLatLng, {k: 1}, (erroMessage,responseCluster) => {
    if(erroMessage) 
      return("SHAKIR FAIL");
    else
    {
      let clusterCentroid = responseCluster[0].centroid;
      let h3IndexCenter = uberH3.geoToH3(clusterCentroid[0],clusterCentroid[1],h3Resolution);
      return(h3IndexCenter);
    }    
  });
}



function rangCalculate(startNo, endNo) {
	let lengthNo = endNo - startNo + 1;
	let returnArray = [];
	for (let i = 0; i < lengthNo; i++) 
    returnArray.push(startNo + i);
  return returnArray;
}





