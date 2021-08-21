//app.js
//Bootcamp - Project2-Opioid-Overdose-statistics-team

var baseFlaskAppCloudUrl = "https://bccloudflask.uc.r.appspot.com/api/v1.0/opioidstats/";

createVisualizations();

function createVisualizations(){
  createChart1Visualization()
  createChart2Visualization()
  createChart3Visualization()
  createChart4Visualization()
}

// handle chart 1 filters on change event
d3.selectAll('#chart-1-select-year, #chart-1-select-month, #chart-1-select-state')
  .on('change', function() {    
    createChart1Visualization();
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
  
  d3.json(chart1DataUrl).then(function(records) {

    // Replace this block with visualization --- MATT
    // #########################################################################
    // Just rendering 3 rows to show how to get data for visualization
    
    var chart1RowsContainer = d3.select("#chart-1-rows")
    chart1RowsContainer.html("");
    for (var i = 0; i < (records.length >= 3 ? 3 : records.length); i++) {
      var row = chart1RowsContainer.append("tr");
      Object.entries(records[i]).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
      });
    }
    // ########################################################################
    
  });
}

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
    for (var i = 0; i < (filtered.length >= 3 ? 3 : filtered.length); i++) {
      var row = chart2RowsContainer.append("tr");
      var yearCell = row.append("td");
      yearCell.text(filtered[i].Year);
      var countCell = row.append("td");
      countCell.text(filtered[i].OverdoseDeathCount);     
    }
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
 
  
  d3.json(chart3DataUrl).then(function(records) {

    // Replace this block with visualization  -- Patrick
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
    // ########################################################################
    
  });

}

function createChart4Visualization(){

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

