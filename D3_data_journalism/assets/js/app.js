// set the dimensions and margins of the svg
function makeResponsive() {
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;
  
// set the dimensions and margins of the graph
var margin = {top: 10, right: 60, bottom: 80, left: 110},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page and group element
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
   .attr("transform","translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./assets/data/data.csv").then( function(data) {
   Object.entries(data).forEach(([key, value]) => {
   console.log(key,value)});

   var chosenXAxis ="age"   //default
   var chosenYAxis ="income" //default
  // Add X axis
  var x = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.97,
             d3.max(data, d => d[chosenXAxis]) * 1.02])
    .range([ 0, width]);
   svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .attr("class", "x_axislabels")
     .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.94,
           d3.max(data, d => d[chosenYAxis]) * 1.05])
    .range([height, 0]);
  svg.append("g")
    .attr("class", "y_axislabels")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleLinear()
  .domain([83, 100])
  .range([81, 100]);

  // Add a scale for bubble color
  const myColor = d3.scaleOrdinal()
    //.domain(["AL", "AK", "AR", "CA", "CO", "CT"])
    .range(d3.schemeSet2);

  // -1- Create a tooltip div that is hidden by default:
   const tooltip = d3.select("#scatter")
   .append("div")
     .style("opacity", 0)
     .attr("class", "tooltip")
     .style("background-color", "black")
     .style("border-radius", "5px")
     .style("padding", "10px")
     .style("color", "white")

 // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
 const showTooltip = function(event, d) {
   tooltip
     .transition()
     .duration(200)
   tooltip
     .style("opacity", 1)
     .html("State: " + d.state + ", Income: " + d.income + ", Age: " + d.age + ", Poverty " + d.poverty + ", Smokes " + d.smokes + ", Healthcare " + d.healthcare +", Obesity: " + d.obesity)
     .style("left", (event.x)/2 + "px")
     .style("top", (event.y)/2+30 + "px")
 }
 const moveTooltip = function(event, d) {
   tooltip
     .style("left", (event.x)/2 + "px")
     .style("top", (event.y)/2+30 + "px")
 }
 const hideTooltip = function(event, d) {
   tooltip
     .transition()
     .duration(200)
     .style("opacity", 0)
 }

  // Add dots
   var circlesGroup = svg.append('g')
    .attr("class", "node_wrapper")
    .selectAll("dot")
    .data(data)
    .join("g")
    .attr("class", "bubble_wrapper")
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", d => x(d[chosenXAxis]))
      .attr("cy", d => y(d[chosenYAxis]))
      .attr("r", d => z(d.obesity))
      .style("fill", d => myColor(d.abbr)) 
      // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip ) 

    d3.selectAll(".bubble_wrapper")
    .data(data)
    .append("text").text(d => d.abbr)
    .attr("text-anchor", "middle")
    .attr("x", d => x(d[chosenXAxis]))
    .attr("y", d => y(d[chosenYAxis]))
 

// Create Extra y-axis click labels
var ylabelsGroup = svg.append("g")
.attr("class", "y_options")
.attr("transform", `translate(${width-width-95}, ${height - 250})`);

var incomeLabel = ylabelsGroup.append("text")
.attr("x", 20)
.attr("y", -40)
.attr("class", "ylabels")
.attr("value", "income") // value to grab for event listener
.classed("active", true)
.text("Income");

var smokeLabel = ylabelsGroup.append("text")
.attr("x", 20)
.attr("y", -20)
.attr("class", "ylabels")
.attr("value", "smokes") // value to grab for event listener
.classed("active", false)
.classed("inactive", true)
.text("Smokes");

var obesityLabel = ylabelsGroup.append("text")
.attr("x", 20)
.attr("y", 0)
.attr("class", "ylabels")
.attr("value", "obesity") // value to grab for event listener
.classed("active", false)
.classed("inactive", true)
.text("Obesity");

// Create Extra x-axis click labels
var xlabelsGroup = svg.append("g")
.attr("class", "x_options")
.attr("transform", `translate(${width / 2}, ${height + 10})`);

var ageLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y",20)
.attr("class", "xlabels")
.attr("value", "age") // value to grab for event listener
.classed("active", true)
.text("Age");

var povertyLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 40)
.attr("class", "xlabels")
.attr("value", "poverty") // value to grab for event listener
.classed("inactive", true)
.text("Poverty");

var healthLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("class", "xlabels")
.attr("value", "healthcare") // value to grab for event listener
.classed("inactive", true)
.text("Healthcare");

// $$$ Y AXIS Event listener INCOME/SMOKE/OBESITY Click $$$
d3.selectAll("text.ylabels")
  .on("click", function() {
  var value = d3.select(this).attr("value");
  var chosenYAxis = value;
  d3.select(this).classed("active", true);
  d3.select(this).classed("inactive", false);
  
  console.log("Values currently selected");
  console.log(chosenXAxis);
  console.log(chosenYAxis);

  d3.selectAll("g.x_axislabels").remove();
  d3.selectAll("g.y_axislabels").remove(); 
  d3.selectAll("g.node_wrapper").remove().transition().duration(9000);

  if (chosenXAxis === "poverty") {
    var xmin = 8
    var xmax = 24}
  if (chosenXAxis === "healthcare") {
      var xmin = 3
      var xmax = 28}
  if (chosenXAxis === "age") {
      var xmin = 28
      var xmax = 48}

  var x = d3.scaleLinear()
    .domain([xmin,xmax])   
    .range([ 0, width]);
   svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .attr("class", "x_axislabels")
     .call(d3.axisBottom(x));

  if (chosenYAxis === "income") {
      var ymin = 35000
      var ymax = 75000}
  if (chosenYAxis === "smokes") {
        var ymin = 9
        var ymax = 28}
  if (chosenYAxis === "obesity") {
          var ymin = 20
          var ymax = 40}

  var y = d3.scaleLinear()
    .domain([ymin,ymax])   
    .range([height, 0]);
  svg.append("g")
    .transition()
    .duration(600)
    .attr("class", "y_axislabels")
    .call(d3.axisLeft(y));

  var circlesGroup = svg.append('g')
    .attr("class", "node_wrapper")
    .selectAll("dot")
    .data(data)
    .join("g")
    .attr("class", "bubble_wrapper")
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", d => x(d[chosenXAxis]))
      .attr("cy", d => y(d[chosenYAxis]))
      .attr("r", d => z(d.obesity))
      .style("fill", d => myColor(d.abbr)) 
      // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
    d3.selectAll(".bubble_wrapper")
    .data(data)
    .append("text").text(d => d.abbr)
    .attr("text-anchor", "middle")
    .attr("x", d => x(d[chosenXAxis]))
    .attr("y", d => y(d[chosenYAxis]))
    .transition()
    .duration(4000)

  // Unselected option classes to change bold text off
    if (chosenYAxis !== "income") {
      incomeLabel
      .classed("active", false)
      .classed("inactive", true);}
    if (chosenYAxis !== "obesity") {
      obesityLabel
      .classed("active", false)
      .classed("inactive", true);}
    if (chosenYAxis !== "smokes") {
       smokeLabel
       .classed("active", false)
       .classed("inactive", true);}

  })

// $$$ X AXIS Event listener AGE/POVERTY/HEALTHCARE Click $$$
d3.selectAll("text.xlabels")
  .on("click", function() {
  var value = d3.select(this).attr("value");
  chosenXAxis = value;
  chosenYAxis = d3.select("text.ylabels.active").attr("value");
  d3.select(this).classed("active", true);
  d3.select(this).classed("inactive", false);

  console.log("Values currently selected");
  console.log(chosenXAxis);
  console.log(chosenYAxis);

  d3.selectAll("g.x_axislabels").remove(); 
  d3.selectAll("g.y_axislabels").remove(); 
  d3.selectAll("g.node_wrapper").remove().transition().duration(9000);

  if (chosenXAxis === "poverty") {
    var xmin = 8
    var xmax = 24}
  if (chosenXAxis === "healthcare") {
      var xmin = 3
      var xmax = 28}
  if (chosenXAxis === "age") {
       var xmin = 28
       var xmax = 48}

  //update x-Axis
  var x = d3.scaleLinear()
  .domain([xmin,xmax])
  .range([ 0, width-120]);
  svg.append("g")
   .transition()
   .duration(400)
   .attr("transform", "translate(0," + height + ")")
   .attr("class", "x_axislabels")
   .call(d3.axisBottom(x));

   if (chosenYAxis === "income") {
    var ymin = 35000
    var ymax = 75000}
  if (chosenYAxis === "smokes") {
      var ymin = 9
      var ymax = 28}
  if (chosenYAxis === "obesity") {
        var ymin = 20
        var ymax = 40}

  var y = d3.scaleLinear()
    .domain([ymin,ymax])   
    .range([height, 0]);
  svg.append("g")
    .attr("class", "y_axislabels")
    .call(d3.axisLeft(y));

   var circlesGroup = svg.append('g')
   .attr("class", "node_wrapper")
   .selectAll("dot")
   .data(data)
   .join("g")
   .attr("class", "bubble_wrapper")
   .append("circle")
     .attr("class", "bubbles")
     .attr("cx", d => x(d[chosenXAxis]))
     .attr("cy", d =>y(d[chosenYAxis]))
     .attr("r", d => z(d.obesity))
     .style("fill", d => myColor(d.abbr)) 
     // -3- Trigger tooltip functions
   .on("mouseover", showTooltip )
   .on("mousemove", moveTooltip )
   .on("mouseleave", hideTooltip )

   d3.selectAll(".bubble_wrapper")
   .data(data)
   .append("text").text(d => d.abbr)
   .attr("text-anchor", "middle")
   .attr("x", d => x(d[chosenXAxis]))
   .attr("y", d => y(d[chosenYAxis]))
   .transition()
   .duration(9000)

   // unselected option classes to change bold text off
  if (chosenXAxis !== "poverty") {
      povertyLabel
       .classed("active", false)
       .classed("inactive", true);
  }
  if (chosenXAxis !== "healthcare") {
      healthLabel
       .classed("active", false)
       .classed("inactive", true);
  }
  if (chosenXAxis !== "age") {
      ageLabel
       .classed("active", false)
       .classed("inactive", true);
  }

  });


// ****** Extra labels end *******

//brackets to close then function and catch then errors
}).catch(function(error) {
  console.log(error);
});
//brackets to close responsive function
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
