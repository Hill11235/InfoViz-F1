let width = 1000;					//specifies the width, height and margins of our SVG element
let height = 600;
let margin = 100;
let xMid = width / 2;
let yMid = height / 2;
let dataset;

function clearHeatMap() {
    var svg = d3.select("#chart1")
    svg.selectAll("*").remove();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function plotHeatmapOnTrack() {
    await sleep(250)
    console.log(dataset)
    //convert X and Y attributes back to integers
    let selectValue = heatMapMetric;
    let speedMax = d3.max(dataset, (d) => d[selectValue]);
    let colorScale = d3.scaleLinear()
        .domain([0, speedMax])
        .range(["#FFFF00", "#FF0000"]);
    let toolTip = d3.select("#chart1")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "2px");
    //update colour based on metric at that point
    d3.select("svg")
        .selectAll("circle")
        .style("fill", function (d) {
            console.log(selectValue)
            if (selectValue === "nGear") {
                var scaler = d3.scaleOrdinal()
                    .domain([1, 2, 3, 4, 5, 6, 7, 8])
                    .range(["gold", "green", "orange", "blue", "purple", "red", "pink", "brown"]);
                return scaler(d[selectValue]);
            } else {
                return colorScale(d[selectValue]);
            }
        })
        .on("mouseenter", function (event, d) {
            d3.select(this)
                .style("fill", "#000000");
            toolTip.style("visibility", "visible")
                .style("top", (event.pageY) + "px").style("left", (event.pageX) + "px")
                .html("<p>" + selectValue + ": " + d[selectValue] + "<br>Time: " + d.Time.substring(10, 18) + " (min/s/ms)</p>");
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .style("fill", function (d) {
                    console.log(selectValue)
                    if (selectValue === "nGear") {
                        var scaler = d3.scaleLinear()
                            .domain([1, 2, 3, 4, 5, 6, 7, 8])
                            .range(["gold", "green", "orange", "blue", "purple", "red", "pink", "brown"]);
                        return scaler(d[selectValue]);
                    } else {
                        return colorScale(d[selectValue]);
                    }
                });
            toolTip.style("visibility", "hidden");
        });
}

function drawTrack() {
    d3.csv("data/" + raceName + "/LEC_" + raceName + "_Lap_Number" + lapNumber + "_Telemetry_Data.csv")
        .then(function (myData) {

            d3.select("#chart1")        //creates an SVG element
                .append("svg")
                .attr("id", "speedSVG")
                .attr("width", width + margin)
                .attr("height", height + margin);

            let toolTip = d3.select("#chart1")
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "2px");

            //convert X and Y attributes back to integers
            myData.forEach(function (d) {
                d.X = +d.X;
                d.Y = +d.Y;
                d.Speed = +d.Speed;
                d.nGear = +d.nGear;
                d.Throttle = +d.Throttle;
                d.DistanceToDriverAhead = parseFloat(d.DistanceToDriverAhead);
            });

            dataset = myData;

            //define initial values to be plotted
            let selectValue = heatMapMetric;
            let xMax = d3.max(myData, (d) => d.X);
            let yMax = d3.max(myData, (d) => d.Y);
            let speedMax = d3.max(myData, (d) => d[selectValue]);
            let colorScale = d3.scaleLinear()
                .domain([0, speedMax])
                .range(["#FFFF00", "#FF0000"]);

            d3.select("svg")
                .selectAll("circle")
                .data(myData)
                .enter().append("circle")
                .style("fill", (d) => colorScale(d.Speed))
                .attr("cx", function (d) {
                    return (xMid + xMid * (d.X / xMax)) - 150;
                })
                .attr("cy", function (d) {
                    return yMid + yMid * (d.Y / yMax);
                })
                .attr("r", 15)
                .on("mouseenter", function (event, d) {
                    d3.select(this)
                        .style("fill", "#000000");
                    toolTip.style("visibility", "visible")
                        .style("top", (event.pageY) + "px").style("left", (event.pageX) + "px")
                        .html("<p>" + selectValue + ": " + d[selectValue] + "<br>Time: " + d.Time.substring(10, 18) + " (min/s/ms)</p>");
                })
                .on("mouseout", function (event, d) {
                    d3.select(this)
                        .style("fill", (d) => colorScale(d.Speed));
                    toolTip.style("visibility", "hidden");
                });
        });
}
drawTrack()
plotHeatmapOnTrack()