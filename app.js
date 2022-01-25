// used local environment fix from Cecelia Zhang [https://github.com/yxz674] to work around the 
// issue of d3.json not working with local files
// console: "python -m http.server" 
// OR right click index.html and select "Open With Live Server (CTRL+L CTRL+O)"

// use d3 to read in samples.json and arrane data
function init() {
  d3.json("data\samples.json").then((data) => {

// array of subject id numbers
  var subjectID = data.names;
// loop through the array of subject id numbers
  var firstEntry = subjectID[0];

  updatePlotly(firstEntry);
  });
}

// start the dashboard

init();

d3.selectAll("#selDataset").on("change", updatePlotly);
d3.json("samples.json").then((data) => {
  var select = document.getElementById("selDataset")
  var dropdown = data.names;
  // console.log(dropdown);
// loop thru and increase counter by 1 for each iteration of dropdown entries
  for (let i = 0; i < dropdown.length; i++) {
      let selection = dropdownMenu[i];
      let main = document.createElement("option");
      main.text = selection;
      main.value = selection;
      select.add(main);
  };
});

// function to update the plotly chart
function updatePlotly() {
  d3.json("samples.json").then((data) => {
  let id = d3.select("#selDataset").property("value");

  let filteredID = data.samples.filter(sample => sample.id == id);
  // console.log(filteredID);

  // get sample values, and top ten values
  let values = filteredID.map(items => items.sample_values).sort();
  let top_samples = sortValues[0].slice(0,10).reverse();
  // get otu_ids, and top 10 otu_ids
  let otu_ids = filteredID.map(items => items.otu_ids).sort();
  let topOtus = otu_ids[0].slice(0,10).reverse().toString().split(",").map((idnumber) => `OTU ${idnumber}`);
  // console.log(topOtus);
  // get otu labels, and get top 10
  let otu_labels = filteredID.map(items => items.otu_labels).sort();
  let top_labels = otu_labels[0].slice(0,10).reverse();
  // include all values and labels for bubble chart
  let all_values = sortValues[0];
  let ids = otu_ids[0];
  let labels = otu_labels[0];

// bar chart with dropdown to select an individual subject
  let trace1 = {
      x: top_samples,
      y: topOtus,
      text: top_labels,
      type: "bar",
      orientation: "h"
  };

  let traceData = [trace1];

  let layout = {
      margin: {
          l: 100,
          r: 100,
          t: 100
      }
  };
  Plotly.newPlot("bar", traceData, layout);

// bubble chart displaying each sample in a subject
  let trace2 = {
      x: ids,
      y: all_values,
      mode: "markers",
      text: labels,
      type: "bubble",
      marker: {size: all_values, color: ids, colorscale: "Electric"}
  };

  let traceData2 = [trace2];

  let layout2 = {
      height: 600,
      width: 1200,
      xaxis: {title: "OTU ID"},
      };

  Plotly.newPlot("bubble", traceData2, layout2);

  // filter metadata 
  let metadata = data.metadata.filter((items) => items.id == id);
  //  display individual subject metadata
  demographicInfo = metadata[0];
  detailedInfo = Object.entries(demographicInfo).map(([key, value]) => `${key}: ${value}`).join("");
  // console.log(detailedInfo);
// read in metadata and display demographic info from json
  document.getElementById("sample-metadata").innerHTML = detailedInfo;
  });
};