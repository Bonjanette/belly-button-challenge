const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let datasets;

d3.json(url).then(function (data) {
  BBdata = data;
  datasets = data.names;
  generateOptions();
  createBarChart("940");
  createBubbleChart("940");
  listMetadata("940");
  washGuage("940");
});

function generateOptions() {
  let dropDown = document.getElementById("selDataset");
  for (let i = 0; i < datasets.length; i++) {
    let dataset = document.createElement("option");
    dataset.text = datasets[i];
    dataset.value = parseInt(datasets[i]);
    dropDown.appendChild(dataset);
  }
}

function optionChanged(selectedDataset) {
  createBarChart(selectedDataset);
  createBubbleChart(selectedDataset);
  listMetadata(selectedDataset);
  washGuage(selectedDataset);
}

function createBarChart(selectedDataset) {
  let samples = BBdata.samples;
  let chosenSample = samples.find(function (sample) {
    return sample.id === selectedDataset;
  });

  let samplevals = chosenSample.sample_values;
  let otuVals = chosenSample.otu_ids;
  let otuLabels = chosenSample.otu_labels;

  let barVals = samplevals.slice(0, 10).reverse();
  let labels = otuVals.slice(0, 10);
  let ylabels = [];

  for (let i = 0; i < 10; i++) {
    ylabels.push(`OTU ${labels[i]}`);
  }
  let hoverText = otuLabels.slice(0, 10);

  let barTrace = {
    x: barVals,
    y: ylabels,
    text: hoverText,
    name: "Bar",
    marker: { color: "brown" },
    type: "bar",
    orientation: "h",
  };
  let traceData = [barTrace];

  let layout = {
    title: "Operational Taxonomic Units<br> AKA Microbes Found",
  };
  Plotly.newPlot("bar", traceData, layout);
}

function createBubbleChart(selectedDataset) {
  let samples = BBdata.samples;
  let chosenSample = samples.find(function (sample) {
    return sample.id === selectedDataset;
  });
  let colorScale = d3
    .scaleLinear()
    .domain([
      d3.min(chosenSample.otu_ids),
      d3.median(chosenSample.otu_ids),
      d3.max(chosenSample.otu_ids),
    ])
    .range(["brown", "yellow", "#337AB7"]);

  let bubbleTrace = {
    x: chosenSample.otu_ids,
    y: chosenSample.sample_values,
    text: chosenSample.otu_labels,
    mode: "markers",
    marker: {
      color: chosenSample.otu_ids.map(function (id) {
        return colorScale(id);
      }),
      size: chosenSample.sample_values,
      sizeref: 0.1,
      sizemode: "area",
    },
  };
  let bubbleData = [bubbleTrace];
  let bubbleLayout = {
    title: "",
    showlegend: false,
    xaxis: {
      title: "OTU ID",
    },
  };
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}
function listMetadata(selectedDataset) {
  let metadata = BBdata.metadata;
  let chosenMetadata = metadata.find(function (metadata) {
    return metadata.id === parseInt(selectedDataset);
  });
  console.log(chosenMetadata);
  d3.select("#sample-metadata")
    .html(`id: ${chosenMetadata.id}<br>ethnicity: ${chosenMetadata.ethnicity}<br>
  gender: ${chosenMetadata.gender}<br> age: ${chosenMetadata.age}<br>
  location: ${chosenMetadata.location}<br>bbtype: ${chosenMetadata.bbtype}<br>wfreq: ${chosenMetadata.wfreq}`);
}
function washGuage(selectedDataset) {
  let metadata = BBdata.metadata;
  let chosenMetadata = metadata.find(function (metadata) {
    return metadata.id === parseInt(selectedDataset);
  });
  let pointerValue = chosenMetadata.wfreq;
  let angle = (pointerValue / 9) * 180;
  let guageData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: chosenMetadata.wfreq,
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        mode: "html",
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 9] },
        shape: "path",
        path: "M 0.5 0.1 L 0.4 0.9 L 0.6 0.9 Z",
        fillcolor: "black",
        line: { color: "black" },
        xaxis: "x",
        yaxis: "y",
        sizex: 0.2,
        sizey: 0.2,
        sizing: "scaled",
        transform: `rotate(${angle})`,
      },
    },
  ];
  let guageLayout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
  Plotly.newPlot("gauge", guageData, guageLayout);
}
