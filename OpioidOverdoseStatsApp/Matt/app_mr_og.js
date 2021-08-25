// select the user input field
var id_Selector = d3.select("#selDataset");

// select the demographic info div's ul list group
var demo_info = d3.select("#sample-metadata");

// select the bar chart div
var bar_chart = d3.select("#bar");

// Store API link
var queryUrl= "https://bccloudflask.uc.r.appspot.com/api/v1.0/opioidstats/deathcounts/"

// use init function to populate blank dropdown menu with IDs and draw charts by default (using ID)
function init() {

    // Grab the data with d3
    d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
         //createFeatures(data.features);
    //});

   //d3.csv("../Data/opiod_crisis_stats.csv", function(data) {
   //    for var = 
   //d3.csv("../Data/opiod_crisis_stats.csv"}).then((data => {

        // ----------------------------------
        // POPULATE DROPDOWN MENU WITH IDs 
        

        //  use a forEach to loop over each state in the array data.names to populate dropdowns with IDs
        data.state.forEach((state => {
            var option = id_Selector.append("option");
            option.text(state);
        }))

        //  use a forEach to loop over each year in the array data.names to populate dropdowns with IDs
        data.year.forEach((year => {
            var option = id_Selector.append("option");
            option.text(year);
        }))
        //  use a forEach to loop over each month in the array data.names to populate dropdowns with IDs
        data.month.forEach((month => {
            var option = id_Selector.append("option");
            option.text(month);
        }
        )); // close forEach



        // get the first ID from the list for initial charts as a default
        var initId = id_Selector.property("value")

        // plot charts with initial ID
        plotCharts(initId);

    })); // close .then()

} // close init() function

//shim

// create a function to reset divs to prepare for new data
function resetData() {

    // ----------------------------------
    // CLEAR DATA
    

    demo_info.html("");
    bar_chart.html("");

}; // close resetData()

// create a function to read JSON and plot charts
function plotCharts(id) {

    // read in the JSON data
    //d3.json("data/samples.json").then((data => {

        // ----------------------------------
        // POPULATE DEMOGRAPHICS TABLE
        

        // filter the metadata for the ID chosen
        var individualMetadata = data.metadata.filter(participant => participant.id == id)[0];

        // get the wash frequency for gauge chart later
        var wfreq = individualMetadata.wfreq;

        // Iterate through each key and value in the metadata
        Object.entries(individualMetadata).forEach(([key, value]) => {

            var newList = demo_info.append("ul");
            newList.attr("class", "list-group list-group-flush");

            // append a li item to the unordered list tag
            var listItem = newList.append("li");

            // change the class attributes of the list item for styling
            listItem.attr("class", "list-group-item p-1 demo-text bg-transparent");

            // add the key value pair from the metadata to the demographics list
            listItem.text(`${key}: ${value}`);

        }); // close forEach

        // ----------------------------------
        // RETRIEVE DATA FOR PLOTTING CHARTS
       

        // filter the samples for the ID chosen
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        // create empty arrays to store sample data
        var otuIds = [];
        var otuLabels = [];
        var sampleValues = [];

        // Iterate through each key and value in the sample to retrieve data for plotting
        Object.entries(individualSample).forEach(([key, value]) => {

            switch (key) {
                case "otu_ids":
                    otuIds.push(value);
                    break;
                case "sample_values":
                    sampleValues.push(value);
                    break;
                case "otu_labels":
                    otuLabels.push(value);
                    break;
                    // case
                default:
                    break;
            } // close switch statement

        }); // close forEach

        // slice and reverse the arrays to get the top 10 values, labels and IDs
        var topOtuIds = otuIds[0].slice(0, 10).reverse();
        var topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        var topSampleValues = sampleValues[0].slice(0, 10).reverse();

        // use the map function to store the IDs with "OTU" for labelling y-axis
        var topOtuIdsFormatted = topOtuIds.map(otuID => "OTU " + otuID);

       // ----------------------------------
        // PLOT BAR CHART
       

        // create a trace
        var traceBar = {
            x: topSampleValues,
            y: topOtuIdsFormatted,
            text: topOtuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(29,145,192)'
            }
        };

        // create the data array for plotting
        var dataBar = [traceBar];

        // define the plot layout
        var layoutBar = {
            height: 500,
            width: 600,
            font: {
                family: 'Quicksand'
            },
            hoverlabel: {
                font: {
                    family: 'Quicksand'
                }
            },
            title: {
                text: `<b>Top OTUs for Test Subject ${id}</b>`,
                font: {
                    size: 18,
                    color: 'rgb(34,94,168)'
                }
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: 'rgb(34,94,168)'
            },
            yaxis: {
                tickfont: { size: 14 }
            }
        }


        // plot the bar chart to the "bar" div
        Plotly.newPlot("bar", dataBar, layoutBar);

        

}; // close plotCharts() function



// when there is a change in the dropdown select menu, this function is called with the ID as a parameter
function optionChanged(id) {

    // reset the data
    resetData();

    // plot the charts for this id
    plotCharts(id);


} // close optionChanged function

// call the init() function for default data
init();