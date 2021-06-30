// Use d3.json() to fetch data from JSON file
var otus_data={};

d3.json("../../data/samples.json").then((importedData)=>{
    var otus_data = importedData;
    console.log(otus_data);

    // Populate selector drop down with OTUs Names
    var names = Object(otus_data.names)

    for (var i=0; i<=names.length; i++){
        var options = d3.select("#selDataset").append("option");
        options.text(names[i])
    }
    
    d3.select("#count").text(names.length);

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
        
        d3.select("#ethnicity").text(ethnicity);
        d3.select("#location").text(location);

        for (var i = 0; i < filtered_metaData.length; i++) {
            var obj = filtered_metaData[i];
            for (var key in obj) { 
                var panel = d3.select("#sample-metadata").append("li")
                panel.text(`${key}: ${obj[key]}`)
            }
        }

        filtered_data=Object(otus_data.samples).filter(sample=>sample.id===selector_id)
        var ids = Object(filtered_data).map(row => row.otu_ids)[0];
        var values = Object(filtered_data).map(row => row.sample_values)[0];
        var text = filtered_data.map(row => row.otu_labels)[0];

        ids_name = ids.map(otu_id => {return "OTU "+ otu_id});
        
        d3.select("#otus_count").text(ids.length);
        d3.select("#subject_id").text(selector_id);

        var cultures_found=values.reduce((a, b) => a + b, 0)
        d3.select("#cultures-found").text(cultures_found)
        d3.select("#greatest-found").text(Math.max.apply(Math, values))
        d3.select("#smallest-found").text(Math.min.apply(Math, values))

        var traceBar = {
            x: values.slice(0,10),
            y: ids_name.slice(0,10),
            text:text.slice(0,10),
            name: "OTUS",
            type: "bar",
            marker: {
              color: "#0d6efd"},
            orientation: "h"
        };

        // Create the data array for the plot
        var data_bar = [traceBar];

        // Define the plot layout
        var layout_bar = {            
            xaxis: { 
                // title: "x title" 
            },
            yaxis: { 
                autorange : "reversed"
            },
            height: 300,
            width: 300,
            margin: {
              l: 80,
              r: 20,
              b: 20,
              t: 10,
              pad: 3
            },
            font:{
              family: 'Roboto, sans-serif'
            }, 

        };

        // Plot bar chart"
        Plotly.newPlot("bar", data_bar, layout_bar,{displayModeBar: false});

        var trace_bubble = {
            x: ids,
            y: values,
            text: text,
            mode: 'markers',
            marker: {
            color: ids,
            size: values,
            colorscale: 'YlGnBu'   
            }
        };
    
        var data_bubble = [trace_bubble];
        
        var layout_bubble = {
            xaxis: {title:"OTU ID"},
            height: 260,
            width: 700,
            margin: {
              l: 40,
              r: 20,
              b: 40,
              t: 20,
              pad: 4
            }
              
        };
        
        
        Plotly.newPlot('bubble', data_bubble, layout_bubble);

        var wfreq = filtered_metaData.map(sample=>sample.wfreq)[0]
        

        var data_gauge = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              type: "indicator",
              mode: "gauge+number",
              

              gauge: {
                bar:{color: "#0d6efd",
                  thickness:1},
                axis: {range: [null, 9] },
                steps: [
                  { range: [0, 1], color: "#FFFFFF" },
                  { range: [1, 2], color: "#FFFFFF" },
                  { range: [2, 3], color: "#FFFFFF" },
                  { range: [3, 4], color: "#FFFFFF" },
                  { range: [4, 5], color: "#FFFFFF" },
                  { range: [5, 6], color: "#FFFFFF" },
                  { range: [6, 7], color: "#FFFFFF" },
                  { range: [7, 8], color: "#FFFFFF" },
                  { range: [8, 9], color: "#FFFFFF" },
                ],
              }
            }
          ];
          
          var layout_gauge = { 
            font:{family: 'Roboto, sans-serif'},  
            height: 140,
              margin: {
                l: 20,
                r: 20,
                b: 0,
                t: 15,
                pad: 3
              }
            };

          Plotly.newPlot('gauge', data_gauge, layout_gauge);

    }
})


