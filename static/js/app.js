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
    let select = document.getElementById("selDataset")
    let dropdown = data.names;