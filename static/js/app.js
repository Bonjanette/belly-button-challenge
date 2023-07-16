const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let datasets;

d3.json(url).then(function (data) {
  BBdata = data;
  datasets = data.names;
  console.log(BBdata);
  console.log(datasets);
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
    // let dropDown = document.getElementById("selDataset");
    // let selectedDataset = dropDown.value;
    console.log(selectedDataset);
  }

