//app.js
//Bootcamp - Project2-Opioid-Overdose-statistics-team

var baseFlaskAppCloudUrl = "https://bccloudflask.uc.r.appspot.com/api/v1.0/opioidstats/";

createVisualizations();

function createVisualizations(){
  createChart1Visualization()
  createChart2Visualization()
  createChart3Visualization()
  createChart4Visualization()
  createChart5Visualization()
}

// handle chart 1 filters on change event
d3.selectAll('#chart-1-select-year, #chart-1-select-month, #chart-1-select-state')
  .on('change', function() {    
    createChart1Visualization();
});
//+chart 5 (Matt Added)
d3.selectAll('#chart-1-select-year, #chart-1-select-month, #chart-1-select-state')
  .on('change', function() {    
    createChart5Visualization();
});

// handle chart 2 filters on change event
d3.selectAll('#chart-2-select-state, #chart-2-select-month')
  .on('change', function() {    
    createChart2Visualization();
});

// handle chart 3 filters on change event
d3.selectAll('#chart-3-select-year, #chart-3-select-month')
  .on('change', function() {    
    createChart3Visualization();
});

// handle chart 4 filters on change event
d3.selectAll('#chart-4-select-year, #chart-4-select-month, #chart-4-select-opioid')
  .on('change', function() {    
    createChart4Visualization();
});

function createChart1Visualization(){
  
  var chart1BaseUrl = `${baseFlaskAppCloudUrl}deathCountsByDrugs`
  
  var yearFilter = d3.select("#chart-1-select-year").property('value');
  var monthFilter = d3.select("#chart-1-select-month").property('value');
  var stateFilter = d3.select("#chart-1-select-state").property('value');

  var chart1DataUrl = chart1BaseUrl;
  if (yearFilter != "0") {
    chart1DataUrl = `${chart1DataUrl}/year/${yearFilter}`;
  }
  if (monthFilter != "0") {
    chart1DataUrl = `${chart1DataUrl}/month/${monthFilter}`;
  }
  if (stateFilter != "0") {
    chart1DataUrl = `${chart1DataUrl}/state/${stateFilter}`;
  }
  console.log("url1 =",chart1DataUrl)
  
  d3.json(chart1DataUrl).then(function(records) {

    // Replace this block with visualization --- MATT
    // #########################################################################
    // Just rendering 3 rows to show how to get data for visualization
    indicator_list = [];
    death_list = [];
    var chart1RowsContainer = d3.select("#chart-1-rows")
    chart1RowsContainer.html("");
    for (var i = 0; i < (records.length); i++) {
      var row = chart1RowsContainer.append("tr");
      Object.entries(records[i]).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
        //console.log(typeof value)
        //console.log(key)
        //Add Key to one list and value to another list
        //const [indicator_split,death_split] = value.split(")")
        //const indicator_split = split_value[0]
        //const death_split = split_value[1]
        //if (key == "Indicator") {indicator_list = indicator_list + value}
        //if (key == "OverdoseDeathCount") {death_list = death_list + value}
        //indicator_list = indicator_list+key+value //indicator.append(key)
        //death_list = death_list+key+value
        switch (key) {
         case "Indicator":
              indicator_list.push(value);
              break;
          case "OverdoseDeathCount":
              death_list.push(value);
              break;
              // case
          default:
              break;
      } // close switch statement
      });
    };
  
    
console.log(indicator_list)
//console.log(typeof indicator_list)
console.log(death_list)
//console.log(typeof death_list)
        
      // Create the Trace
      console.log(indicator_list)
      var trace1 = {
        x: death_list,
        y: indicator_list,
        //labels: indicator_list,
        type: "bar",
        orientation: 'h',
      };
console.log(trace1)
      // Create the data array for the plot
      var data = [trace1];
console.log(data)
      // Define the plot layout
      var layout = {
        height: 500,
        width: 700,
        title: "Indicator vs. Deaths",
        xaxis: { title: "No. of Deaths" },
        yaxis: { title: "Indicator" }
      };
    
  // Plot the chart to a div tag with id "bar-plot"
      Plotly.newPlot("bar-plot", data, layout);


    // ########################################################################
    //};
  }
  )};

function createChart2Visualization(){
  var chart2BaseUrl = `${baseFlaskAppCloudUrl}deathCountsByYear`
  
  var monthFilter = d3.select("#chart-2-select-month").property('value');
  var stateFilter = d3.select("#chart-2-select-state").property('value');

  var chart2DataUrl = chart2BaseUrl;  
  if (stateFilter != "0") {
    chart2DataUrl = `${chart2DataUrl}/state/${stateFilter}`;
  }
  if (monthFilter != "0") {
    chart2DataUrl = `${chart2DataUrl}/month/${monthFilter}`;
  }
 
  
  d3.json(chart2DataUrl).then(function(records) {

    // Replace this block with visualization  -- IRINIA
    // #########################################################################
    // Just rendering 3 rows to show how to get data for visualization
    
    var filtered = records.filter(function(d){
      return d["Indicator"] === "Number of Drug Overdose Deaths"
    })

    var chart2RowsContainer = d3.select("#chart-2-rows")
    chart2RowsContainer.html("");
    for (var i = 0; i < (records.length); i++) {
      var row = chart2RowsContainer.append("tr");
      var yearCell = row.append("td");
      yearCell.text(filtered[i].year);
      var countCell = row.append("td");
      countCell.text(filtered[i].OverdoseDeathCount);     
    }

    
    //console.log(countCell)
    // ########################################################################
    
  });
}

function createChart3Visualization(){
  var chart3BaseUrl = `${baseFlaskAppCloudUrl}deathCountsByState`
  
  var yearFilter = d3.select("#chart-3-select-year").property('value');
  var monthFilter = d3.select("#chart-3-select-month").property('value');

  var chart3DataUrl = chart3BaseUrl;  
  if (yearFilter != "0") {
    chart3DataUrl = `${chart3DataUrl}/year/${yearFilter}`;
  }
  if (monthFilter != "0") {
    chart3DataUrl = `${chart3DataUrl}/month/${monthFilter}`;
  }
 
  console.log('url=',chart3DataUrl)
  d3.json(chart3DataUrl).then(function(records) {

    // Replace this block with visualization  -- IRINIA
    // #########################################################################
    // Just rendering 3 rows to show how to get data for visualization     

    // Trick Trick yuck --- Columns as rows - transpose

    var filteredOverdose = records.filter(function(d){
      return d["Indicator"] === "Number of Drug Overdose Deaths"
    })

    var filteredTotalDeaths = records.filter(function(d){
      return d["Indicator"] === "Number of Deaths"
    })

    var chart3RowsContainer = d3.select("#chart-3-rows")
    chart3RowsContainer.html("");
    for (var i = 0; i < (filteredOverdose.length >= 3 ? 3 : filteredOverdose.length); i++) {
      
      var row = chart3RowsContainer.append("tr");
      var yearCell = row.append("td");
      yearCell.text(filteredTotalDeaths[i].State);

      var totalDeathCountCell = row.append("td");
      totalDeathCountCell.text(filteredTotalDeaths[i].OverdoseDeathCount);    
      
      var overdoseDeathCountCell = row.append("td");
      overdoseDeathCountCell.text(filteredOverdose[i].OverdoseDeathCount);       
    }
//#######################################################

  
  
      // ########################################################################
      
    });
  
}

function createChart4Visualization(){

}

//Chart 5
/*function createChart5Visualization(){
  //createChart5Visualization(){
    
   var chart5BaseUrl = 'http://127.0.0.1:5000/api/v1.0/opioidstats/deathCountsBySummary' //`${baseFlaskAppCloudUrl}deathCountsBySummary`
   console.log('chart5:',chart5BaseUrl)
  /*console.log(chart5BaseUrl)
    var yearFilter = d3.select("#chart-1-select-year").property('value');
    var monthFilter = d3.select("#chart-1-select-month").property('value');
    var stateFilter = d3.select("#chart-1-select-state").property('value');
  
    var chart5DataUrl = chart5BaseUrl;
    if (yearFilter != "0") {
      chart5DataUrl = `${chart5DataUrl}/year/${yearFilter}`;
    }
    if (monthFilter != "0") {
      chart5DataUrl = `${chart5DataUrl}/month/${monthFilter}`;
    }
    if (stateFilter != "0") {
      chart5DataUrl = `${chart5DataUrl}/state/${stateFilter}`;
    }
    
    d3.json(chart5BaseUrl).then(function(records) {
    console.log("rec:",records)
    
      // Replace this block with visualization --- MATT
      // #########################################################################
      // Just rendering 3 rows to show how to get data for visualization
      
      var chart5RowsContainer = d3.select("#chart-5-rows")
      chart5RowsContainer.html("");
      for (var i = 0; i < (records.length); i++) {
        var row = chart5RowsContainer.append("tr");
        Object.entries(records[i]).forEach(([key, value]) => {
          var cell = row.append("td");
          cell.text(value);
        });
      }
      // ########################################################################
      
    });
  }


// var opioidData = "https://bccloudflask.uc.r.appspot.com/api/v1.0/opioidstats/deathcounts/year/2018"

// // Perform a GET request to the query URL
// d3.json(opioidData).then(function(data) {
//   createVisualization(data)
// });

// function createVisualization(data) {

//     // get hold of the tbody table element
//     var tbody = d3.select('tbody')

//     data.forEach((ufosighting) => {

//         // append row to tbody for each json object in the json data array
//         var row = tbody.append("tr");

//         //append a cell to each table row for every key value in the json object in the json dat array
//         Object.entries(ufosighting).forEach(([key, value]) => {
//           var cell = row.append("td");
//           cell.text(value);
//         });

//       });

// }


