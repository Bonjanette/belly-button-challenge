const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let datasets;

d3.json(url).then(function (data) {
  BBdata = data;
  datasets = data.names;
  generateOptions();
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
}

function createBarChart(selectedDataset) {
  let samples = BBdata.samples;
  let chosenSample = samples.find(function (sample) {
    return sample.id === selectedDataset;
  });

  let samplevals = chosenSample.sample_values;
  let otuVals = chosenSample.otu_ids;
  let otuLabels = chosenSample.otu_labels;

  let barVals = samplevals.slice(0, 10);
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
    type: "bar",
    orientation: "h"
  }
  let traceData = [barTrace];

  let layout = {
    title: "Operational Taxonomic Units<br> AKA Microbes Found"
  }
  Plotly.newPlot("bar", traceData, layout);
  console.log(barVals, labels, hoverText);
}
