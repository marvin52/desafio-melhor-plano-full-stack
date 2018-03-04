const express = require('express');
const fs = require('fs');
const port = 3001

const app = express();


function returnPlanByName(name, arrayOfPlans){
  for(var i in arrayOfPlans)
    if(name === arrayOfPlans[i].name)
      return arrayOfPlans[i];
  return false;
}

function comparePrice(a,b) {
  if (a.price < b.price)
    return -1;
  if (a.price > b.price)
    return 1;
  return 0;
}

app.use('/', express.static(__dirname + '/build'));




app.get("/list-all-broadband", function(req, res) {

  const { plans } = JSON.parse(fs.readFileSync('plans.json', 'utf8'));

  let plansArr = []

  for( let i in plans){
    let tempName = plans[i].name
    let totalCost = plans[i].price
    let combinations = [];
    let { bundles } = plans[i]

    let tempArr = [tempName]
    plansArr.push({bundle: tempArr, price: totalCost})


    let getBundles = function(bundleList, plansList, bundleArray, cost){
      for(let a in bundleList){
        let bundleObj = returnPlanByName(bundleList[a].name, plansList)
        let tempBundleArray = bundleArray.slice();
        let tempCost = parseInt(cost)

        tempCost += bundleList[a].cost
        tempCost += bundleObj.price

        tempBundleArray.push(bundleObj.name)

        plansArr.push({bundle: tempBundleArray, price: tempCost})

        if(bundleObj.bundles.length > 0){
          getBundles(bundleObj.bundles, plansList, tempBundleArray, tempCost)
        }
      }
    }

    if( bundles.length > 0 )
      getBundles(bundles, plans, tempArr, totalCost);

  }

   res.send(JSON.stringify(plansArr.sort(comparePrice)));
});


app.listen(port);

console.log('Listening on port ', port);
