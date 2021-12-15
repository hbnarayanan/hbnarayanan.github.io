const margin = 80;
const w = 1000 - 2 * margin;
const h = 600 - 2 * margin;

const margins = { top: 50, left: 100, bottom: 175, right: 100 }
const innerWidth = w - margins.left - margins.right;
const innerHeight = h - margins.top - margins.bottom;

var pop;
var times = 0;

function filterItems(arr, year) {
	return arr.filter(function(el) {
	  return el.Year == year;
	})
  }

d3.csv('https://raw.githubusercontent.com/hbnarayanan/cs639/main/thefinalmovieBar.csv').then((data, error) => {
  if (error) throw error;

  // Create a select dropdown
  const mySelection = document.getElementById("selectMe");

  d3.select(mySelection)
  .append("span")
  .append("p")
  .attr("class", "label")
  .text("Pick a Year to Get Started!")
  .style('color', "black")
  .style("font-size", "14px");

  const selectItems = 
  [
	  "2000", 
	  "2001", 
	  "2002",
	  "2003",
	  "2004",
	  "2005",
	  "2006",
	  "2007",
	  "2008",
	  "2009",
	  "2010", 
	  "2011", 
	  "2012",
	  "2013",
	  "2014",
	  "2015",
	  "2016",
	  "2017",
	  "2018",
	  "2019",
	  "2020",
	  "2021"
	];

  // Create a drop down
  d3.select(mySelection)
    .append("span")
    .append("select")
    .attr("id", "selection")
    .attr("name", "tasks")
    .selectAll("option")
    .data(selectItems)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  // When the page loads, display no chart until fixes
//    document.addEventListener("DOMContentLoaded", myChart ())
document.getElementById('selection').value = "1"

  // Chart changes based on drop down selection
  d3.select("#selection").on("change", function() {
	const selectedOption = d3.select(this).node().value;

	if (times != 0) {
		data = pop;
	}
	times = 1;
	data.forEach(d => {
		d.Title = d.Title;
		d.Rating = +d.Rating;
		d.Year = +d.Year;
	  });

	  pop = data;
	data = filterItems(data,selectedOption);
    myChart();
  })


// Draw the chart
  function myChart () {
    // Append SVG to this DIV
    const chartDIV = document.createElement("div");

    // Create scales
    const xScale = d3.scaleBand()
    .domain(data.map((d) => d.Title))
	.range([0, innerWidth])
	.paddingInner(0.05);

    const yScale = d3.scaleLinear()
      .domain([50,100]).nice()
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom().scale(xScale);

    const yAxis = d3.axisLeft().scale(yScale);

    const svg = d3.select(chartDIV)
      .append("svg")
      .attr("viewBox", [0,0,w,h]);

    const mainG = svg
      .append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const g = mainG
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")

	var tooltip = d3.select("#tooltip")
	.style("opacity", 1)
	.attr("class", "tooltip")
	.style("background-color", "white")
	.style("border", "solid")
	.style("border-width", "1px")
	.style("border-radius", "5px")
	.style("padding", "5px")
	.style("position", "absolute")

// create the bars
    g.append("rect")
	.attr("class", "bars")
	.attr("x", d => xScale(d.Title))
	.attr("y", d => yScale(d.Rating))
	.attr("width", innerWidth/data.length-10)
	.attr("height", (d) => innerHeight - yScale(d.Rating))
	.attr("fill", d => d.Rating == d3.max(data, d => d.Rating) ? "#fea889" : "lightblue")
	.on('mouseenter', function (actual, i) {
		d3.selectAll('.count')
		  .attr('opacity', 0)
  
		d3.select(this)
		  .transition()
		  .duration(300)
		  .attr('opacity', 0.6)
		  .attr('x', (a) => xScale(a.Title) - 5)
		  .attr('width', innerWidth/data.length)
		  tooltip
            .style("opacity", 0.8)
			.style("background-color", "white")
            .html('Movie Title: ' + actual.Title + ', IMDb Rating: ' + actual.Rating)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

		const y = yScale(actual.Rating)
  
		line = g.append('line')
		  .attr('id', 'limit')
		  .attr('x1', 0)
		  .attr('y1', y)
		  .attr('x2', innerWidth)
		  .attr('y2', y)
	  })

	  .on('mouseleave', function () {
		d3.selectAll('.count')
		  .attr('opacity', 1)
  
		d3.select(this)
		  .transition()
		  .duration(300)
		  .attr('opacity', 1)
		  .attr('x', (a) => xScale(a.Title))
		  .attr('width', innerWidth/data.length-10)
		tooltip
          .style("opacity", 0)
  
		g.selectAll('#limit').remove()
	  })

    mainG
      .append("g")
	  .call(xAxis)
	  .style("font", "8px times")
	  .attr("transform", `translate(0, ${innerHeight})`)
	.selectAll("text")
		.attr("y", 0)
		.attr("x", 9)
		.attr("dy", ".35em")
		.attr("transform", "rotate(45)")
		.style("text-anchor", "start");  

// create the y aixs
    mainG
      .append("g")
	  .call(yAxis);
	  
// add y axis label
	mainG
	  .append('text')
	  .attr('class', 'label')
	  .attr('x', -(h / 2) + margin)
	  .attr('y', margin / 100 - 50)
	  .attr('transform', 'rotate(-90)')
	  .attr('text-anchor', 'middle')
	  .text('IMDb Rating')
  
// add x axis label
	mainG
	  .append('text')
	  .attr('class', 'label')
	  .attr('x', margin + 240)
	  .attr('y', margin + 300)
	  .attr('text-anchor', 'middle')
	  .text('Show / Movie Title')
  
	mainG
	  .append('text')
	  .attr('class', 'title')
	  .attr('x', margin + 240)
	  .attr('y', margin - 100)
	  .attr('text-anchor', 'middle')
	  .text('Top Ten Shows / Movies in the United States in a Given Year')	

    // This code will redraw charts based on dropdown selection. At any point in time, chartContainer DIV only contains one chart. The charts are recycled.
    const showChart = document.getElementById("chartContainer");
    while (showChart.firstChild) {
      showChart.firstChild.remove();
    }
    showChart.appendChild(chartDIV);

  }

});