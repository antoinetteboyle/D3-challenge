# D3-challenge
Visualisation analysing the health risks facing particular demographics from the U.S. Census Bureau and the Behavioural Risk Factor Surveillance System based on 2014 ACS 1-year estimates. The data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

The main code is found in a folder named [D3_data_journalism]("./D3_data_journalism"). The graphic in the [app.js](./assets/js/app.js) file which pulls in the data from [data.csv](./assets/data/data.csv) using the "d3.csv".

I created a scatter plot:
- between two of the data variables y-axis: Income, Smokes, Obesity (x-axis: Age, Poverty, Healthcare)- representing each state with circle elements and depicting state abbreviations in the circles.
- situated axes and labels to the left and bottom of the chart.

`python -m http.server` can be used to run the visualisation hosting the page at `localhost:8000` in the web browser. The visualisation has been deployed to Github pages.

Additional labels in the scatter plot have click events so that users can decide which data to display. Animated the transitions for the circles' locations as well as the range of axes. Created three risk factors for each axis.

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Tooltips reveal a specific element's data when the user hovers their cursor over the element. Tooltips are added to circles and displays each tooltip with the data.