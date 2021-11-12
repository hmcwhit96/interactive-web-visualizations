// used local environment fix from Cecelia Zhang [https://github.com/yxz674] to work around the 
// issue of d3.json not working with local files
// console: "python -m http.server" 
// OR right click index.html and select "Open With Live Server (CTRL+L CTRL+O)"

// use d3 to read in samples.json and arrane data
function init() {
    d3.json("samples.json").then((data) => {

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
// loop and increase counter by 1 for each iteration of dropdown entries
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
    let topOtus = otu_ids[0].slice(0,10).reverse().toString().split(",").map(idnumber) => `OTU ${idnumber}`);
    // console.log(topOtus);
    // get otu labels, and get top 10
    let otu_labels = filteredID.map(items => items.otu_labels).sort();
    let top_labels = otu_labels[0].slice(0,10).reverse();