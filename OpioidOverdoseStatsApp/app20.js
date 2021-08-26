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

// handle chart filters on change event
d3.selectAll('#chart-0-select-year, #chart-0-select-month, #chart-0-select-state')
  .on('change', function() {    
    createVisualizations()
});

d3.selectAll('#chart-0-select-opioid')
  .on('change', function() {    
    createChart4Visualization()
});


function createChart1Visualization(){
  
  var chart1BaseUrl = `${baseFlaskAppCloudUrl}deathCountsByDrugs`
  
  var yearFilter = d3.select("#chart-0-select-year").property('value');
  var monthFilter = d3.select("#chart-0-select-month").property('value');
  var stateFilter = d3.select("#chart-0-select-state").property('value');

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
    indicator_list = [];
    death_list = [];
   
    for (var i = 0; i < (records.length); i++) {
      Object.entries(records[i]).forEach(([key, value]) => {
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
      type: "bar",
      orientation: 'h',
    };    

    //console.log(trace1)
    // Create the data array for the plot
    var data = [trace1];
    //console.log(data)
    // Define the plot layout
    var layout = {
      //title: "Indicator vs. Deaths",
      yaxis: { automargin: true},
      xaxis: { title: "No. of Deaths", titlefont: {size:16} },
      autosize: true
    };
       
    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bar-plot", data, layout);
    
  });
}

function createChart2Visualization(){
  var chart2BaseUrl = `${baseFlaskAppCloudUrl}deathCountsByYear`
  
  var monthFilter = d3.select("#chart-0-select-month").property('value');
  var stateFilter = d3.select("#chart-0-select-state").property('value');

  var chart2DataUrl = chart2BaseUrl;  
  if (stateFilter != "0") {
    chart2DataUrl = `${chart2DataUrl}/state/${stateFilter}`;
  }
  if (monthFilter != "0") {
    chart2DataUrl = `${chart2DataUrl}/month/${monthFilter}`;
  }
  
  d3.json(chart2DataUrl).then(function(records) {

    var filtered = records.filter(function(d){
      return d["Indicator"] === "Number of Drug Overdose Deaths"
    })

    var year = [];
    var death_list =[];
    var chart2RowsContainer = d3.select("#chart-2-rows")
    chart2RowsContainer.html("");
    for (var i = 0; i < (filtered.length); i++) { 
      var row = chart2RowsContainer.append("tr");
      var yearCell = row.append("td");
      yearCell.text(filtered[i].Year);
      var countCell = row.append("td");
      countCell.text(filtered[i].OverdoseDeathCount); 
      year.push(filtered[i].Year);  
      death_list.push(filtered[i].OverdoseDeathCount);
    };

    var trace2 = {
      x: year,
      y:death_list,
      type:"line",
      orientation:'h'
    }
       
    var data = [trace2];
    console.log(data)    
    var layout = {        
      xaxis: {title: 'Number of Deaths'},
      yaxis: {title: 'OverdoseDeathCount'}
    };

    Plotly.newPlot('line-plot', data, layout);
  });
}

function createChart3Visualization(){
  var chart3BaseUrl = `${baseFlaskAppCloudUrl}deathCountsByState`

  var yearFilter = d3.select("#chart-0-select-year").property('value');
  var monthFilter = d3.select("#chart-0-select-month").property('value');

  var chart3DataUrl = chart3BaseUrl;  
  if (yearFilter != "0") {
    chart3DataUrl = `${chart3DataUrl}/year/${yearFilter}`;
  }
  if (monthFilter != "0") {
    chart3DataUrl = `${chart3DataUrl}/month/${monthFilter}`;
  }
 

  d3.json(chart3DataUrl).then(function(records) {

    var filteredOverdose = records.filter(function(d){
      return d["Indicator"] === "Number of Drug Overdose Deaths"
    })

    var filteredTotalDeaths = records.filter(function(d){
      return d["Indicator"] === "Number of Deaths"
    })

    var filteredPerDeaths = records.filter(function(d){
      return d["Indicator"] === "Overdose Death Per 1000 Total Death"
    })

    var filteredPerPop = records.filter(function(d){
      return d["Indicator"] === "Death Per 1000 Population"
    }) 


    total_deaths = []
    od_deaths = []
    states = []
    perThouDeath = []
    perThouPop = []
    var chart3RowsContainer = d3.select("#chart-3-rows")
    chart3RowsContainer.html("");
    for (var i = 0; i < filteredOverdose.length; i++) {

      var row = chart3RowsContainer.append("tr");
      var yearCell = row.append("td");
      yearCell.text(filteredTotalDeaths[i].State);

      var totalDeathCountCell = row.append("td");
      totalDeathCountCell.text(filteredTotalDeaths[i].OverdoseDeathCount);    
      
      var overdoseDeathCountCell = row.append("td");
      overdoseDeathCountCell.text(filteredOverdose[i].OverdoseDeathCount);

      var totalDeathCountCell = row.append("td");
      totalDeathCountCell.text(filteredPerDeaths[i].OverdoseDeathCount.toFixed(2));    
      
      var overdoseDeathCountCell = row.append("td");
      overdoseDeathCountCell.text(filteredPerPop[i].OverdoseDeathCount.toFixed(2)); 

      total_deaths.push(filteredTotalDeaths[i].OverdoseDeathCount);
      od_deaths.push(filteredOverdose[i].OverdoseDeathCount);
      states.push(filteredTotalDeaths[i].State);
      perThouDeath.push(filteredPerDeaths[i].OverdoseDeathCount);
      perThouPop.push(filteredPerPop[i].OverdoseDeathCount);
     
    };
    
    var trace3 = {
      x: perThouPop,
      y : perThouDeath,
      type: "scatter",
      mode: "markers",
      text: states,
      marker: {
        size: perThouDeath
      }
    };
  // console.log(total_deaths);
  // console.log(od_deaths);
  // console.log(states);
  // console.log(perThouPop);
  // console.log(perThouDeath);

   var data3 = [trace3];
   console.log(data3);

   var layout = {    
     hovermode: "closest",
     xaxis: { title: "Overdose Deaths per 1000 Deaths"},
     yaxis: { title: "Total Deaths Per 1000 Persons" },
   };

  Plotly.newPlot("bubble", data3, layout);
    
  });

};

function createChart4Visualization(){
  var chart4BaseUrl = `${baseFlaskAppCloudUrl}deathcounts`
  
  var yearFilter = d3.select("#chart-0-select-year").property('value');
  var monthFilter = d3.select("#chart-0-select-month").property('value');
  var opioidFilter = d3.select("#chart-0-select-opioid").property('value');

  var popupHeader = "Drug Overdose"
  var chart4DataUrl = chart4BaseUrl;  
  if (yearFilter != "0") {
    chart4DataUrl = `${chart4DataUrl}/year/${yearFilter}`;
  }

  if (monthFilter != "0") {
    chart4DataUrl = `${chart4DataUrl}/month/${monthFilter}`;
  }

  if (opioidFilter != "0") {
    chart4DataUrl = `${chart4DataUrl}/indicator/${opioidFilter}`;
    popupHeader = opioidFilter;
  }

  d3.json(chart4DataUrl).then(function(records) {
    d3.json("state_center_geoJSON.json").then(function(stateCenters) {
     
      var deathCounts = [];
      stateCenters.features.forEach(function(feature){
        var result = records.filter(function(record){
          return record.State === feature.properties.Name;
        });
        var deathCount = (result[0] !== undefined) ? result[0].OverdoseDeathCount : null;
        feature.properties.deathCount = deathCount;
        deathCounts.push(deathCount);
      })
      
      var mapContainer = d3.select("#mapContainer")
      mapContainer.html("<div id=\"map\" style=\"position: relative;\"></div>");

      const colorScale = d3.scaleSequential()
        .domain(d3.extent(deathCounts))
        .interpolator(d3.interpolateRainbow);
      
      var withOverdoses = stateCenters.features.filter(function(d){
        return d.properties.deathCount > 0;
      })

      var myIcon = L.icon({
          iconUrl: 'leaflet/images/marker-icon.png',
          iconSize: [10,10],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          shadowUrl: 'leaflet/images/marker-shadow.png',
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
      });

      // Create a GeoJSON layer containing the features array on the statecenters object
      // Run the onEachFeature function once for each piece of data in the array
      var overdoses = L.geoJSON(withOverdoses, {
        onEachFeature: (feature, layer) => layer.bindPopup(
            "<h4>" + popupHeader + ": " + feature.properties.Name +"</h4>" + 
            "<hr><p>Deaths :" + feature.properties.deathCount + "</p>"
        ),
        pointToLayer: (feature, coordinates) => new L.circle(
            coordinates, {
                radius: feature.properties.deathCount ,    
                fillColor: colorScale(feature.properties.deathCount),
                weight: 1,
                opacity: 1,
                color: 'black',  //Outline color
                fillOpacity: 0.7,
                icon: myIcon
            }
        )        
      });

      var lightMapLayer = L.tileLayer(
          "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={access_token}",{
           access_token: API_KEY,
           tileSize: 512,
           zoomOffset: -1,
        });

      var overdoseMap = L.map(
          "map", {
              center:[34.88,-100.99 ],
              zoom: 5,
              layers: [lightMapLayer, overdoses]
          });
      
      var baseMaps = {"Light Map": lightMapLayer}
      var overlayMarkers = {"Overdoses": overdoses}
      
      L.control.layers(baseMaps, overlayMarkers, {
          collapsed: false
      }).addTo(overdoseMap);
      
    });
  });
}

function createChart5Visualization(){
  //createChart5Visualization(){
    
   var chart5BaseUrl = `${baseFlaskAppCloudUrl}deathCountsBySummary`
   console.log('chart5:',chart5BaseUrl)
    
  var yearFilter = d3.select("#chart-0-select-year").property('value');
  var monthFilter = d3.select("#chart-0-select-month").property('value');
  var stateFilter = d3.select("#chart-0-select-state").property('value');

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
  console.log('chart5:',chart5DataUrl)
  d3.json(chart5DataUrl).then(function(records) {
    //Build Summary table
   
    var chart1RowsContainer = d3.select("#chart-5-rows")
    chart1RowsContainer.html("");

    records.sort(function(x,y){
      return d3.ascending(x.Indicator, y.Indicator)
    });

    for (var i = 0; i < (records.length); i++) {
      var row = chart1RowsContainer.append("tr");
      Object.entries(records[i]).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
      });
    }
  });
}