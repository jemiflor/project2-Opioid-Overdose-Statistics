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
d3.selectAll('#chart-5-select-year, #chart-5-select-month, #chart-5-select-state')
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
        // add switch for selecting
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
    }
         // Create the Trace
         console.log(indicator_list)
         var trace1 = {
           x: death_list,
           y: indicator_list,
           //labels: indicator_list,
           type: "bar",
           orientation: 'h',
         };
   //console.log(trace1)
         // Create the data array for the plot
         var data = [trace1];
   //console.log(data)
         // Define the plot layout
         var layout = {
           height: 500,
           width: 800,
           title: "Indicator vs. Deaths",
           xaxis: { title: "No. of Deaths" },
           yaxis: { title: "Indicator" }
         };
       
     // Plot the chart to a div tag with id "bar-plot"
         Plotly.newPlot("bar-plot", data, layout);
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
    // ########################################################################
    
  });

}

function createChart4Visualization(){
  var chart4BaseUrl = `${baseFlaskAppCloudUrl}deathcounts`
  
  var yearFilter = d3.select("#chart-4-select-year").property('value');
  var monthFilter = d3.select("#chart-4-select-month").property('value');
  var opioidFilter = d3.select("#chart-4-select-opioid").property('value');

  var chart4DataUrl = chart4BaseUrl;  
  if (yearFilter != "0") {
    chart4DataUrl = `${chart4DataUrl}/year/${yearFilter}`;
  }

  if (monthFilter != "0") {
    chart4DataUrl = `${chart4DataUrl}/month/${monthFilter}`;
  }

  if (opioidFilter != "0") {
    chart4DataUrl = `${chart4DataUrl}/month/${opioidFilter}`;
  }

}

   // ########################################################################
//Chart 5
function createChart5Visualization(){
  //createChart5Visualization(){
    
   var chart5BaseUrl = 'http://127.0.0.1:5000/api/v1.0/opioidstats/deathCountsBySummary' //`${baseFlaskAppCloudUrl}deathCountsBySummary`
   console.log('chart5:',chart5BaseUrl)
    
  var yearFilter = d3.select("#chart-5-select-year").property('value');
  var monthFilter = d3.select("#chart-5-select-month").property('value');
  var stateFilter = d3.select("#chart-5-select-state").property('value');

  var chart5DataUrl = chart5BaseUrl;
  if (yearFilter != "0") {
    chart1DataUrl = `${chart5DataUrl}/year/${yearFilter}`;
  }
  if (monthFilter != "0") {
    chart5DataUrl = `${chart5DataUrl}/month/${monthFilter}`;
  }
  if (stateFilter != "0") {
    chart5DataUrl = `${chart5DataUrl}/state/${stateFilter}`;
  }
  
  d3.json(chart5DataUrl).then(function(records) {

    // Replace this block with visualization --- MATT
    // #########################################################################
    // Just rendering 3 rows to show how to get data for visualization
    indicator_list = [];
    death_list = [];
    var chart1RowsContainer = d3.select("#chart-5-rows")
    chart1RowsContainer.html("");
    for (var i = 0; i < (records.length); i++) {
      var row = chart1RowsContainer.append("tr");
      Object.entries(records[i]).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
      });
    }
    
        /*var data = [{
          type: 'table',
          header: {
            values: [["<b>EXPENSES</b>"], ["<b>Q1</b>"],
                 ["<b>Q2</b>"], ["<b>Q3</b>"], ["<b>Q4</b>"]],
            align: ["left", "center"],
            line: {width: 1, color: '#506784'},
            fill: {color: '#119DFF'},
            font: {family: "Arial", size: 12, color: "white"}
          },
          cells: {
            values: value,
            align: ["left", "center"],
            line: {color: "#506784", width: 1},
           fill: {color: ['#25FEFD', 'white']},
            font: {family: "Arial", size: 11, color: ["#506784"]}
          }
        }]*/

  
     // Plot the chart to a div tag with id "bar-plot"
     //Plotly.newPlot("summary-table2", data);
/*
        //add switch for selecting
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
  }
          // Create the Trace
          console.log(indicator_list)
          var trace1 = {
            x: death_list,
            y: indicator_list,
            type: "table",
          };
    //console.log(trace1)
          // Create the data array for the plot
          var data = [trace1];
    //console.log(data)
          // Define the plot layout
          var layout = {
            height: 500,
            width: 800,
            title: "Indicator vs. Deaths",
            xaxis: { title: "No. of Deaths" },
            yaxis: { title: "Indicator" }
          };
        
      // Plot the chart to a div tag with id "bar-plot"
          Plotly.newPlot("summary-table", data, layout);
    // ########################################################################
    */
  });
}