# D3-challenge
Visualisation analysing the health risks facing particular demographics from the U.S. Census Bureau and the Behavioural Risk Factor Surveillance System based on 2014 ACS 1-year estimates. The data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

The main code is found in a folder named [D3_data_journalism]("./D3_data_journalism"). The graphic in the [app.js](./assets/js/app.js) file which pulls in the data from [data.csv](./assets/data/data.csv) using the "d3.csv".

I created a scatter plot:
- between two of the data variables Income, Age, Obesity!( or such as `Healthcare vs. Poverty` or `Smokers vs. Age`)- representing each state with circle elements and depicting state abbreviations in the circles.
- situated axes and labels to the left and bottom of the chart.

I used `python -m http.server` to run the visualisation. This will host the page at `localhost:8000` in your web browser.

# 1. More Data, More Dynamics

Additional labels in your scatter plot and give them click events so that your users can decide which data to display. Animate the transitions for your circles' locations as well as the range of your axes. Do this for two risk factors for each axis. Or, for an extreme challenge, create three for each axis.

* Hint: Try binding all of the CSV data to your circles. This will let you easily determine their x or y values when you click the labels.

# 2. Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Add tooltips to your circles and display each tooltip with the data that the user has selected. Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)—we've already included this plugin in your assignment directory.