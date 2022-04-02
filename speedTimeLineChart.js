
//let width = 1000;					//specifies the width, height and margins of our SVG element
//let height = 600;
//let margin = 100;
//let xMid = width / 2;
//let yMid = height / 2;

//consider converting lap time stamp into constituent parts
//not agreeing with Date.parse in current form
let timeConverter = (d) => {
    let lapTime = d.Time.substring(10,18);
    let periods = lapTime.split(":");

    return {
        mins: parseFloat(periods[0]),
        secs: parseFloat(periods[1]),
        totalSec: parseFloat(periods[0])*60 + parseFloat(periods[1]),
        speed: +d.Speed
    }
}

d3.csv(datapath, timeConverter)
    .then((myData) => {

        let timeExtent = d3.max(myData, (d) => +d.totalSec);
        let xScale = d3.scaleLinear()
                            .domain([0, timeExtent])
                            .range([0, width]);
        
        let speedMax = d3.max(myData, (d) => d.speed);
        let yScale = d3.scaleLinear()
                            .domain([0, speedMax+20])
                            .range([height, 0]);

        let x_axis = d3.axisBottom(xScale);
        let y_axis = d3.axisLeft(yScale);

        const colorScale = d3.scaleLinear()
									.domain([0, speedMax])
									.range(["#FFFF00","#FF0000"]);

        let scatter_svg = d3.select("#chart2")        //creates an SVG element in the body
            .append("svg")
            .attr("width", width + margin)
            .attr("height", height + margin);

        scatter_svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", `translate(${margin}, ${height})`)
                        .call(x_axis);
        
        scatter_svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", `translate(${margin}, 0)`)
                        .call(y_axis);

        d3.select(".x.axis")
                    .append("text")
                        .text("Time - seconds")
                        .style("fill", "black")
                        .attr("x", (width - margin)/2)
                        .attr("y", margin-50);
        
        d3.select(".y.axis")
                        .append("text")
                            .text("Speed - km/h")
                            .style("fill", "black")
                            .attr("transform", `rotate(-90,0,${margin-50}) translate(${-margin}, 0)`);

        let lineGenerator = d3.line()
                                .x((d) => margin + xScale(+d.totalSec))
                                .y((d) => yScale(d.speed));

        var toolTip2 = d3.select("#chart1")
                            .append("div")
                                .style("position", "absolute")
                                .style("visibility", "hidden")
                                .style("background-color", "white")
                                .style("border", "solid")
                                .style("border-width", "1px")
                                .style("border-radius", "5px")
                                .style("padding", "2px");

        scatter_svg.append("path")
                            .datum(myData)
                            .attr("class", "line")
                            .attr("id", "myPath")
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .attr("d", lineGenerator)
                            .on("mouseenter", function(event, d){
                                var m = d3.pointer(event);
                                d3.select("#myPath").select("title").text(m[1])
                            })
                            .append("title")
                            .on("mouseout", function(event, d){
                                d3.select(this)
                                    .style("fill", (d) => colorScale(d.Speed));
                                toolTip2.style("visibility", "hidden");
                            });
    });
