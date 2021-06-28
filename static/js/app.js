// Use d3.json() to fetch data from JSON file
var otus_data={};

d3.json("../../samples.json").then((importedData)=>{
    var otus_data = importedData;
    console.log(otus_data);

    // Populate selector drop down with OTUs Names
    var names = Object(otus_data.names)

    for (var i=0; i<=names.length; i++){
        var options = d3.select("#selDataset").append("option");
        options.text(names[i])
    }

    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updateDashboard);

    function updateDashboard() {
        // Clean MetaData Panel
        d3.select("#sample-metadata").text("")
        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // // Assign the value of the dropdown menu option to a variable
        var selector_id = dropdownMenu.property("value");
        
        filtered_metaData = Object(otus_data.metadata.filter(x=>x.id===parseInt(selector_id)))
        
        
        var ethnicity = filtered_metaData.map(sample=>sample.ethnicity)
        var gender = filtered_metaData.map(sample=>sample.gender)
        var age = filtered_metaData.map(sample=>sample.age)
        var location = filtered_metaData.map(sample=>sample.location)
        var bbtype = filtered_metaData.map(sample=>sample.bbtype)
        


        for (var i = 0; i < filtered_metaData.length; i++) { // the plainest of array loops
            var obj = filtered_metaData[i];
            for (var key in obj) { 
                var panel = d3.select("#sample-metadata").append("li")
                panel.text(`${key}: ${obj[key]}`)
                console.log(key, obj[key])
            }
        }


        filtered_data=Object(otus_data.samples).filter(sample=>sample.id===selector_id)
        var ids = Object(filtered_data).map(row => row.otu_ids)[0];
        var values = Object(filtered_data).map(row => row.sample_values)[0];
        var text = filtered_data.map(row => row.otu_labels)[0];

        ids_name = ids.map(otu_id => {return "OTU "+ otu_id});
        
        var traceBar = {
            x: values.slice(0,10),
            y: ids_name.slice(0,10),
            text:text.slice(0,10),
            name: "OTUS",
            type: "bar",
            orientation: "h"
        };

        // Create the data array for the plot
        var data_bar = [traceBar];

        // Define the plot layout
        var layout_bar = {
            xaxis: { 
                title: "x title" 
            },
            yaxis: { 
                autorange : "reversed"
            }
        };

        // Plot bar chart"
        Plotly.newPlot("bar", data_bar, layout_bar);

        // Create trace and layout for bubble chart
        var trace_bubble = {
            x: ids,
            y: values,
            text: text,
            mode: 'markers',
            marker: {
            color: ids,
            size: values
            }
        };
    
        var data_bubble = [trace_bubble];
        
        var layout_bubble = {
            title: 'Bubble Chart Hover Text',    
            width: 600, height: 300    
        };

        console.log(data)
        Plotly.newPlot('bubble', data_bubble, layout_bubble);
        // End of Bubble chart

        var wfreq = filtered_metaData.map(sample=>sample.wfreq)[0]
        console.log(wfreq)

        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              title: { text: "Belly Button Washing Frequency" },
              type: "indicator",
              mode: "gauge+number",

              gauge: {
                axis: {range: [null, 9] },
                steps: [
                  { range: [0, 1], color: "#FFFFFF" },
                  { range: [1, 2], color: "#ccc5df" },
                  { range: [2, 3], color: "#beb1e4" },
                  { range: [3, 4], color: "#af9ee9" },
                  { range: [4, 5], color: "#9e8aed" },
                  { range: [5, 6], color: "#8a77f2" },
                  { range: [6, 7], color: "#7364f6" },
                  { range: [7, 8], color: "#5552f9" },
                  { range: [8, 9], color: "#1c3ffd" },
                ],
                threshold: {
                  line: { color: "blue", width: 5 },
                  thickness: 0.75,
                  value: wfreq
                }
              }
            }
          ];
          
          var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

          Plotly.newPlot('gauge', data, layout);

    }
})


