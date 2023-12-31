// Load the CSV file
d3.csv('CDPH_Environmental_Complaints_Clean.csv').then(function(data) {
    // Calculate the total count of all complaint types
    var totalCount = data.length;

    // Calculate the count of each complaint type
    var counts = {};
    data.forEach(function(d) {
        if (counts[d['COMPLAINT TYPE']] === undefined) {
            counts[d['COMPLAINT TYPE']] = 0;
        }
        counts[d['COMPLAINT TYPE']]++;
    });

    // Calculate the percentage of each complaint type
    var percentages = [];
    for (var complaintType in counts) {
        percentages.push({
            'COMPLAINT TYPE': complaintType,
            'percentage': counts[complaintType] / totalCount * 100
        });
    }

    // Vega-Lite specification for the bar chart
    var bar_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
            "values": percentages
        },
        "mark": "bar",
        "encoding": {
            "x": {"field": "COMPLAINT TYPE", "type": "ordinal", "title": "Complaint Type", "axis": {"labelAngle": -90}},
            "y": {"field": "percentage", "type": "quantitative", "title": "Percentage"},
            "color": {"value": "steelblue"},
            "tooltip": [
                {"field": "COMPLAINT TYPE", "type": "ordinal", "title": "Complaint Type"},
                {"field": "percentage", "type": "quantitative", "title": "Percentage"}
            ]
        },
        "title": "Percentage Distribution of Complaint Types"
    };

    // Embed the bar chart
    vegaEmbed('#vis2', bar_spec).then(function(result) {
        // Handle success
    }).catch(console.error);

    // Vega-Lite specification for the line chart
    var spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
            "values": data
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

    var complaintCounts = {};
data.forEach(function(d) {
    if (complaintCounts[d['STREET TYPE']] === undefined) {
        complaintCounts[d['STREET TYPE']] = 0;
    }
    complaintCounts[d['STREET TYPE']]++;
});

// Create an array of objects, each object representing a street type and its corresponding complaint count
var values = [];
for (var streetType in complaintCounts) {
    values.push({
        'street_type': streetType,
        'count': complaintCounts[streetType]
    });
}

// Vega-Lite specification for the interactive bar chart
var bar_spec2 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {
        "values": values
    },
    "selection": {
        "highlight": {"type": "single", "empty": "none", "on": "click"}
    },
    "mark": "bar",
    "encoding": {
        "x": {"field": "street_type", "type": "ordinal", "title": "Street Type", "axis": {"labelAngle": -45}},
        "y": {"field": "count", "type": "quantitative", "title": "Number of Complaints"},
        "color": {
            "condition": {"selection": "highlight", "value": "orange"},
            "value": "green"
        },
        "tooltip": [
            {"field": "street_type", "type": "ordinal", "title": "Street Type"},
            {"field": "count", "type": "quantitative", "title": "Number of Complaints"}
        ]
    },
    "title": "Spatial Distribution of Complaints by Street Type"
    };
    // Embed the line chart
    vegaEmbed('#vis3', bar_spec2).then(function(result) {
        // Handle success
    }).catch(console.error);

    // Assuming your data is stored in a variable named `data`

    // Define the selection for the line chart
    var brush = {"type": "interval", "encodings": ["x"]};

    // Define the line chart
    var line_chart = {
        "data": {"values": data},
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
        "data": {"values": data},
        "mark": "circle",
        "encoding": {
            "x": {"field": "STREET NUMBER FROM", "type": "nominal", "bin": {"maxbins": 50}},
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
    


});