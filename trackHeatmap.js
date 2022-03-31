let datapath = "data/LEC_Bahrain_Lap_Number56_Telemetry_Data.csv";

let width = 1000;					//specifies the width, height and margins of our SVG element
let height = 600;
let margin = 100;
let xMid = width / 2;
let yMid = height / 2;

d3.csv(datapath)
    .then(function (myData) {
        console.log(myData);

        let svg = d3.select("body")        //creates an SVG element in the body
            .append("svg")
            .attr("width", width + margin)
            .attr("height", height + margin);

        //convert X and Y attributes back to integers
        myData.forEach(function (d) {
            d.X = +d.X;
            d.Y = +d.Y;
        });

        let xMax = d3.max(myData, (d) => d.X);
        let yMax = d3.max(myData, (d) => d.Y);
        let speedMax = d3.max(myData, (d) => parseInt(d.Speed));
				const colorScale = d3.scaleLinear()
										.domain([0, speedMax])
										.range(["#FFFF00","#FF0000"]);

        d3.select("svg")
            .selectAll("circle")
            .data(myData)
            .enter().append("circle")
            .style("fill", (d) => colorScale(d.Speed))
            .attr("cx", function (d) {
                return xMid + xMid * (d.X / xMax);
            })
            .attr("cy", function (d) {
                return yMid + yMid * (d.Y / yMax);
            })
            .attr("r", 2);
    });
