//const dbObject       = require("../includes/includes.js");
const uberH3             = require("h3-js");
const kMeans             = require("node-kmeans");

// exports.clusterH3 = (request, response) => {
//   let parameters      = request.body;
//   let factors         = parameters.factors;
//   let order           = parameters.order;
//   let vehicle         = parameters.vehicle;

//   if(factors == undefined || order == undefined || vehicle == undefined)
//     return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find paramters" });
  
//   if(factors.drops == undefined || factors.weight == undefined || factors.vol == undefined)
//     return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find paramters" });
  
//   if(order.length <= 0)
//     return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find orders" });
  
//   //if(vehicle.length <= 0)
//     //return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find vehicles" });


//   let factorTolerance  = 2;
//   let factorWeight     = factors.weight;
//   let factorDrops      = factors.drops;
//   //let factorVol    = factors.vol;

//   let factorArrayWeigth  = rangCalculate(factorWeight-5,factorWeight+5)
//   let factorArrayDrop    = rangCalculate(factorDrops-5,factorDrops+5)
//   //console.log("factorArrayWeigth",factorArrayWeigth);
//   //console.log("factorArrayDrop",factorArrayDrop);
//   //console.log("----------------");

//   let orderList          = order;
//   let returnArray        = [];

//   for(let resolutionIndex = 15;resolutionIndex > 0;resolutionIndex--)
//   {
//     let h3Array            = {};
//     let factorArray        = {};
//     for(let orderNo = 0;orderNo < orderList.length; orderNo++)
//     {
//         let h3Index     = uberH3.geoToH3(orderList[orderNo].lat,orderList[orderNo].lng,resolutionIndex);
        
//         if(h3Array[h3Index])
//           h3Array[h3Index].push(orderList[orderNo])
//         else
//           h3Array[h3Index] = [orderList[orderNo]]
    
//         if(factorArray[h3Index])
//         {
//           factorArray[h3Index]["drops"]++;
//           factorArray[h3Index]["weight"] += orderList[orderNo].weight;
//           factorArray[h3Index]["vol"]    += orderList[orderNo].vol;       
//         }
//         else
//           factorArray[h3Index] = {"drops" : 1, "weight" : orderList[orderNo].weight, "vol" : orderList[orderNo].vol, "resolutionIndex" : resolutionIndex};
//     }

//     for (const [keyName,valueName] of Object.entries(factorArray)) {
//       let weightPercentage = parseInt((valueName.weight/900)*100);
    
//       if(factorArrayWeigth.indexOf(weightPercentage) > -1 && factorArrayDrop.indexOf(valueName.drops) > -1 )
//       {
//         returnArray.push(h3Array[keyName]);
//         console.log("returnArray",returnArray.length);
//         orderList = removeOrder(orderList,h3Array[keyName]);
//       }
//       // else 
//       // {
//       //   console.log("keyName",keyName);
//       //   console.log("valueName.resolutionIndex",valueName.resolutionIndex);
//       //   console.log("valueName.weight",valueName.weight);
//       //   console.log("valueName.weightPercentage",weightPercentage);
//       //   console.log("valueName.drops",valueName.drops);
//       //   if(valueName.drops > 15 && valueName.drops < 25)
//       //     console.log("TOTAL DROP YES");
//       //   console.log("-------------------------");
//       // }
        
//     }
//   }

//   return response.status(500).send({responseCode : 0, responseMessage : "Clustering successfully", responseData : returnArray });


// };

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
  let orderLatLng  = [];
  let orderList    = [];

  for (let i = 0 ; i < order.length ; i++) {
    let h3Index  = uberH3.geoToH3(order[i].lat,order[i].lng,h3Resolution);
    if(orderList[h3Index])
      orderList[h3Index].push(order[i]);
    else 
      orderList[h3Index] = [order[i]];
    orderLatLng.push([order[i].lat,order[i].lng]);
  }

  kMeans.clusterize(orderLatLng, {k: 1}, (erroMessage,responseCluster) => {
      if(erroMessage) 
        console.error("kmeans ERROR",erroMessage);
      else
      {
        let clusterCentroid = responseCluster[0].centroid;
        let h3Index = uberH3.geoToH3(clusterCentroid[0],clusterCentroid[1],h3Resolution);
        //console.log("h3Index",h3Index);
        //console.log("orderList[h3Index]",orderList[h3Index]);
        //console.log("---------------------");
        let orderArray = [];
        let weightPercentage = 0;
        let factorArray = {"drop" : 0, "weight" : 0};
        let nn =0;
        do {
          while(orderList[h3Index] != "undefined")
            h3Index = uberH3.h3ToParent(h3Index,h3Resolution); 
          console.log("h3Index",h3Index);
          console.log("orderList[h3Index]",orderList[h3Index]);
          // factorArray.drop   += 1;
          // factorArray.weight += orderList[h3Index].weight;
          // weightPercentage = parseInt((factorArray.weight/900)*100);
          // orderArray.push(orderList[h3Index]);
          // console.log("weightPercentage",weightPercentage);
          // console.log("factorArray.weight",factorArray.weight);
          // console.log("factorArray.drop",factorArray.drop);
          //console.log("orderList[h3Index]",orderList[h3Index]);
          //console.log("---------------------");
          nn++;
        }
        while(nn > 10);
        //factorArrayWeight.indexOf(weightPercentage) > -1 && factorArrayDrop.indexOf(factorArray.drop) > -1 
        console.log("orderArray",orderArray);
        console.log("-----------------------");
        
        
        //console.log("h3Index",h3Index);
        // while(orderList[h3Index] != "undefined")
        // {
        //   console.log("h3Index",h3Index);
        //   console.log("orderList[h3Index]",orderList[h3Index]);
        //   h3Index = uberH3.h3ToParent(h3Index,h3Resolution);
        //   console.log("h3Index PARENTS",h3Index);
        // }
          

        // for (const [keyName,valueName] of Object.entries(orderList[h3Index])) {
        //     console.log(keyName,valueName);
        // };
      }
      //return response.status(200).json({responseCode : 1, responseMessage : "Clustering successfully", responseData : responseCluster[0] })
  });

  return response.status(500).send({responseCode : 0, responseMessage : "Clustering successfully", responseData : [] });


};


exports.clusterKmeans = (request, response) => {
  let parameters      = request.body;
  let factors         = parameters.factors;
  let order           = parameters.order;
  let vehicle         = parameters.vehicle;
  let returnArray     = [];
  
  if(factors == undefined || order == undefined || vehicle == undefined)
    return response.status(500).json({responseCode : 0, responseMessage : "Sorry, Unable to find paramters" });
  
  if(factors.drops == undefined || factors.weight == undefined || factors.vol == undefined)
    return response.status(500).json({responseCode : 0, responseMessage : "Sorry, Unable to find paramters" });
  
  if(order.length <= 0)
    return response.status(500).json({responseCode : 0, responseMessage : "Sorry, Unable to find orders" });
  
  //if(vehicle.length <= 0)
    //return response.status(500).send({responseCode : 0, responseMessage : "Sorry, Unable to find vehicles" });

  let factorTolerance  = 2;
  let factorWeight     = factors.weight;
  let factorDrops      = factors.drops;

  let orderLatLng = [];
  for (let i = 0 ; i < order.length ; i++) {
    orderLatLng.push([order[i]['lat'],order[i]['lng']]);
  }

  let clusterNo = parseInt(orderLatLng.length/factorDrops);
  console.log(clusterNo);
  returnArray = kMeans.clusterize(orderLatLng, {k: clusterNo,drops : 20}, (erroMessage,responseCluster) => {
      if(erroMessage) 
        console.error("kmeans ERROR",erroMessage);
      else
        return response.status(200).json({responseCode : 1, responseMessage : "Clustering successfully", responseData : responseCluster[0] })
  });

  //console.log("returnArray",returnArray);

  //return response.status(500).send({responseCode : 0, responseMessage : "Clustering successfully", responseData : returnArray });
};


function nearestLocation(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
      dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}

function orderSplit(responseArray)
{
  let returnArray = [];
  for(let i=0;i<responseArray.length;i++) {
    //console.log("i ---- ",responseArray[i].clusterInd);
    returnArray.push(responseArray[i].clusterInd);
  }

  return returnArray;
}

function rangCalculate(startNo, endNo) {
	let lengthNo = endNo - startNo + 1;
	let returnArray = [];
	for (let i = 0; i < lengthNo; i++) 
    returnArray.push(startNo + i);
  return returnArray;
}

function removeOrder(orderArrayList,removeOrderArray){
  console.log("removeOrder -- before",orderArrayList.length);
  orderArrayList = orderArrayList.filter( function( el ) {
    return removeOrderArray.indexOf( el ) < 0;
  });
  console.log("removeOrder -- after",orderArrayList.length);
  return orderArrayList;
}

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





