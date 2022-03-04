// @TODO: YOUR CODE HERE!
// set the dimensions and margins of the svg
function makeResponsive() {
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;
  
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
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

  // Add X axis
  var x = d3.scaleLinear()
    .domain([29, 45])
    .range([ 0, width-120]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([30000, 82000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleLinear()
  .domain([1000, 100000])
  .range([ 1000, 100000]);

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
     .html("State: " + d.state + ", Income: " + d.income + ", Age: " + d.age + ", Obesity: " + d.obesity)
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

 //const label = node.append('text')
   // .attr('dy', 2)
   // .text(d => d.poverty.substring(0, d.r / 3));

  // Add dots
  svg.append('g')
    .attr("class", "node_wrapper")
    .selectAll("dot")
    .data(data)
    .join("g")
    .attr("class", "bubble_wrapper")
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", d => x(d.age))
      .attr("cy", d => y(d.income))
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
    .attr("x", d => x(d.age))
    .attr("y", d => y(d.income))
      
  //  svg.append("text")      // text label for the x axis
  //      .attr("x", 365 )
  //      .attr("y", 240 )
  //      .style("text-anchor", "middle")
  //      .text("state");

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
