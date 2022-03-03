
// set the dimensions and margins of the svg
function makeResponsive() {
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;
  
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 60},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page and group element
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");


// @@@@ Initial Params
var chosenXAxis = "poverty";
// @@@ function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}
// @@@function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
// @@@function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}
// @@@ function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  var label;
  if (chosenXAxis === "poverty") {
    label = "Poverty:";
  }
  else {
    label = "healthcare:";
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.healthcare}<br>${label} ${d[chosenXAxis]}`);
    });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  return circlesGroup;
}

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
    .attr("class", "x_axislabels")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([30000, 82000])
    .range([ height, 0]);
  svg.append("g")
    .attr("class", "y_axislabels")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleLinear()
  .domain([80, 100])
  .range([ 80, 100]);

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
  var circlesGroup = svg.append('g')
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




 // @@@****** Extra x labels starts

// Create group for two x-axis labels
var labelsGroup = svg.append("g")
.attr("class", "x_optionlabels")
.attr("transform", `translate(${width / 2}, ${height + 10})`);

var povertyLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "poverty") // value to grab for event listener
.classed("active", true)
.text("Poverty");

var ageLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 40)
.attr("value", "age") // value to grab for event listener
.classed("inactive", true)
.text("Age");

// append y axis
circlesGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.classed("axis-text", true)
.text("Health risks Age and Income");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.select("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  console.log(value)
  if (value !== chosenXAxis) {
    // replaces chosenXAxis with value
    chosenXAxis = value;
    console.log(chosenXAxis)
    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(data, chosenXAxis);
    // updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);
    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
      ageLabel
        .classed("active", true)
        .classed("inactive", false);
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});
// ****** Extra labels end


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
