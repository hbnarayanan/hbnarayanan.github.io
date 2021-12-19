// set the dimensions and margins of the graph
var margin = {top: 20, right: 10, bottom: 40, left: 100},
    width = 1200 - margin.left - margin.right,
       height = 600 - margin.top - margin.bottom;

// The svg
var svg = d3.select("svg")
 .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  
    const g = svg.append('g');



// create a tooltip
    var tooltip = d3.select("#tooltip")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "#c3cfff")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute")
 

      
// Map and projection
//var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(120)
  .center([0,20])
  .translate([width / 2 - margin.left, height / 2]);

// Data and color scale
var data = d3.map();

//var my_domain = [100000, 1000000, 10000000, 30000000, 100000000, 500000000]
var domain = [10,50,100,200,500,1000,3000,5000]
var labels = ["0-10 ", "10-50", "50-100","100-200","200-500","500-1000","1000-3000","3000-5000"]
var range = d3.schemeBlues[8]
var colorScale = d3.scale.threshold()
  .domain(domain)
  .range(range);


var promises = []
promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
promises.push(d3.csv("https://raw.githubusercontent.com/hbnarayanan/cs639/main/movies_map.csv", function(d) { data.set(d.code,[d.count, d.country, d.neflix_sum, d.hulu_sum, d.prime_sum, d.disney_sum]); }))


myDataPromises = Promise.all(promises).then(function(topo) {


  
  
  let mouseOver = function(d) {
      d3.selectAll(".topo")
        
          .transition()
          .duration(200)
          .style("opacity", .8)

          

        
      d3.select(this)
        //.filter(function(d){d.total = data.get(d.id) || 0; return d.total <= max_pop && d.total >= min_pop})
        .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black")
      
        movie_count = data.get(d.id)[0] || 0;
        netflix=data.get(d.id)[2] || 0;
        hulu=data.get(d.id)[3] || 0;
        prime=data.get(d.id)[4] || 0;
        disney=data.get(d.id)[5] || 0;
        tooltip
            .style("opacity", 1)
            .html(d.properties.name+ " Total Movie Count: " + movie_count+ "\n Netflix: "+netflix+ "\n Hulu: "+hulu+ "\n Prime: "+prime+ "\n Disney: "+disney)
            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 28) + "px")
                  .style("background-color", "#fea889");
            
        d3.select("#annotation")
      .style("opacity", 0)  
        
//d3.format(",.2r")(d.count)
  }

  let mouseLeave = function(d) {
    d3.selectAll(".topo")
      // .transition()
      // .duration(200)
      .style("opacity", 1)
      
    // d3.selectAll(".topo")
    //   // .transition()
    //   // .duration(200)
    //   .style("stroke", "transparent")
      
    d3.select("#annotation")
      .style("opacity", 1)
      
    tooltip
          .style("opacity", 0)
  }

  var topo = topo[0]

    // Draw the map
    svg.append("g")
      .selectAll("path")
      
      .data(topo.features)
      .enter()
      .append("path")
      .attr("class", "topo")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        .attr("stroke", "black")
        // set the color of each country
        .attr("fill", function (d) {
          my_movies = data.get(d.id) || 0
          return colorScale(my_movies[0] || 0);
        })
        .style("opacity", .7)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )


 
      
    // legend
    var legend_x = width - margin.left
    var legend_y = height - 200
    svg.append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(" + legend_x + "," + legend_y+")");

  var legend = d3.legendColor()
      .labels(labels)
      .title("Movies Count")
      .scale(colorScale)
    
    
     svg.select(".legendQuant")
      .call(legend);



        svg.call(d3.zoom().on('zoom', () => {
    svg.attr('transform', d3.event.transform);
  }));

  


    })
