// Load the CSV file
d3.csv('CDPH_Environmental_Complaints_Clean.csv').then(function(data) {

    function updateViz(year) {
        // Filter the data based on the selected year
        var filteredData = data.filter(d => new Date(d['COMPLAINT DATE']).getFullYear() === year);

        // Vega-Lite specification for the line chart
        var spec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "data": {
                "values": filteredData
            },
            "mark": "line",
            "encoding": {
                "x": {
                    "field": "COMPLAINT DATE",
                    "type": "temporal",
                    "timeUnit": "yearmonth"
                },
                "y": {
                    "aggregate": "count",
                    "type": "quantitative"
                }
            },
            "selection": {
                "highlight": {"type": "single", "encodings": ["x"]},
                "dateFilter": {
                    "type": "interval", 
                    "encodings": ["x"], 
                    "bind": "scales"
                }
            },
            "title": "Number of Complaints Over Time",
            "width": 800,
            "height": 400
        };

        // Embed the line chart
        vegaEmbed('#vis1', spec).then(function(result) {
            // Handle success
        }).catch(console.error);

    }

    // Add an event listener for the change event on the select element
    document.getElementById('year-select').addEventListener('change', function(e) {
        // Update the visualization with the selected year
        updateViz(+e.target.value);
    });

    // Initialize the visualization with the first year
    updateViz(2018);

    ////////////////////////////////////////////////////////////////////////////////////////////////

    function updateScatterPlot(streetName, direction) {
        var filteredData2 = data.filter(d => d['STREET NAME'] == streetName && d['DIRECTION'] == direction);
    
        // Define the selection for the line chart
        var brush = {"type": "interval", "encodings": ["x"]};

        // Define the line chart
        var line_chart = {
            "data": {"values": filteredData2},
            "mark": "line",
            "encoding": {
                "x": {"field": "COMPLAINT DATE", "type": "temporal", "timeUnit": "yearmonth"},
                "y": {"aggregate": "count", "type": "quantitative"},
                "color": {"field": "DIRECTION", "type": "nominal"},
                "tooltip": {"aggregate": "count", "type": "quantitative"}
            },
            "width": 600,
            "height": 300,
            "selection": {
                "brush": brush
            }
        };

        // Define the scatter plot
        var scatter_chart = {
            "data": {"values": filteredData2},
            "mark": "circle",
            "encoding": {
                "x": {"field": "COMPLAINT DATE", "type": "nominal", "bin": {"maxbins": 50}},
                "y": {"aggregate": "count", "type": "quantitative"},
                "color": {"field": "DIRECTION", "type": "nominal"},
                "tooltip": {"aggregate": "count", "type": "quantitative"}
            },
            "transform": [{"filter": {"selection": "brush"}}],
            "width": 600,
            "height": 300
        };

        // Concatenate both charts
        var linked_view = {
            "vconcat": [line_chart, scatter_chart],
            "resolve": {"scale": {"y": "independent"}}
        };

        // Embed the linked view
        vegaEmbed('#vis4', linked_view);
    }
    
// Add an event listener for the change event on the select elements
document.getElementById('street-name-select').addEventListener('change', function(e) {
    // Update the scatter plot with the selected street name and direction
    updateScatterPlot(e.target.value, document.getElementById('direction-select').value);
});

document.getElementById('direction-select').addEventListener('change', function(e) {
    // Update the scatter plot with the selected street name and direction
    updateScatterPlot(document.getElementById('street-name-select').value, e.target.value);
});

// Initialize the scatter plot with the first street name and direction
updateScatterPlot('FAIRFIELD', 'N');

// Function to update the charts based on the selected street name
function updateCharts(streetName) {
    
    // Line chart for temporal trends
    var lineChart = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "values": data },
        "width": 400,
        "height": 300,
        "mark": "line",
        "encoding": {
            "x": {"field": "COMPLAINT DATE", "type": "temporal", "timeUnit": "yearmonth"},
            "y": {"aggregate": "count", "type": "quantitative"},
            "color": {"field": "DIRECTION", "type": "nominal"},
            "tooltip": {"aggregate": "count", "type": "quantitative"}
        },
        "transform": [{
            "filter": {"field": "STREET NAME", "oneOf": [streetName]}
        }],
        "selection": {
            "brush": {"type": "interval", "encodings": ["x"]}
        }
    };

    // Bar chart for count of complaints by direction
    var barChart = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "values": data },
        "width": 400,
        "height": 100,
        "mark": "bar",
        "encoding": {
            "x": {"field": "DIRECTION", "type": "nominal"},
            "y": {"aggregate": "count", "type": "quantitative"},
            "color": {"field": "DIRECTION", "type": "nominal"},
            "tooltip": {"aggregate": "count", "type": "quantitative"}
        },
        "transform": [{
            "filter": {"field": "STREET NAME", "oneOf": [streetName]}
        }]
    };

    // Concatenate both charts
    var linkedView2 = {
        "vconcat": [lineChart, barChart],
        "resolve": {"scale": {"y": "independent"}}
    };

    // Embed the linked view
    vegaEmbed('#vis5', linkedView2);
}

// Add an event listener for the change event on the street name select
document.getElementById('street-name-select2').addEventListener('change', function(e) {
    // Update the charts with the selected street name
    updateCharts(e.target.value);
});

// Initialize the charts with the first street name
updateCharts('KINZIE');

});