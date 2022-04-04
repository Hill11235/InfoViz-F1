let graphWidth = 500;					//specifies the width, height and margins of our SVG element
let graphHeight = 240;
let graphMargin = 40;

let timeConverter = (d) => {
    let lapTime = d.Time.substring(10,18);
    let periods = lapTime.split(":");

    return {
        mins: parseFloat(periods[0]),
        secs: parseFloat(periods[1]),
        totalSec: parseFloat(periods[0])*60 + parseFloat(periods[1]),
        Speed: +d.Speed,
        nGear: +d.nGear,
        Throttle: +d.Throttle,
        DistanceToDriverAhead: parseFloat(d.DistanceToDriverAhead)
    }
}

function clearLineGraph() {
    var svg = d3.select("#chart3")
    svg.selectAll("*").remove();
}

function createLineGraph(){
    d3.csv("data/" + raceName + "/LEC_" + raceName + "_Lap_Number" + lapNumber + "_Telemetry_Data.csv", timeConverter)
        .then((myData) => {
            let selectValue = heatMapMetric;

            let timeExtent = d3.max(myData, (d) => +d.totalSec);
            let xScale = d3.scaleLinear()
                .domain([0, timeExtent])
                .range([0, graphWidth]);

            let speedMax = d3.max(myData, (d) => d[selectValue]);
            let yScale = d3.scaleLinear()
                .domain([0, speedMax])
                .range([graphHeight, 50]);

            let x_axis = d3.axisBottom(xScale);
            let y_axis = d3.axisLeft(yScale);

            let scatter_svg = d3.select("#chart3")        //creates an SVG element in the body
                .append("svg")
                .attr("id", "lineSVG")
                .attr("width", graphWidth + graphMargin)
                .attr("height", graphHeight + graphMargin);

            scatter_svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(${graphMargin}, ${graphHeight})`)
                .call(x_axis);

            scatter_svg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${graphMargin}, 0)`)
                .call(y_axis);

            d3.select(".x.axis")
                .append("text")
                .text("Time - seconds")
                .style("fill", "black")
                .attr("x", (graphWidth - graphMargin)/2)
                .attr("y", graphMargin-50);

            d3.select(".y.axis")
                .append("text")
                .text(selectValue)
                .style("fill", "black")
                .attr("transform", `rotate(-90,0,${graphMargin-50}) translate(${-graphMargin}, 0)`);

            let lineGenerator = d3.line()
                .x((d) => graphMargin + xScale(+d.totalSec))
                .y((d) => yScale(d[selectValue]));

            scatter_svg.append("path")
                .datum(myData)
                .attr("class", "line")
                .attr("id", "myPath")
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("d", lineGenerator);
        });
}
createLineGraph()