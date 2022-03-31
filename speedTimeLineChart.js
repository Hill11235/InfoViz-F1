
//let width = 1000;					//specifies the width, height and margins of our SVG element
//let height = 600;
//let margin = 100;
//let xMid = width / 2;
//let yMid = height / 2;

d3.csv(datapath)
    .then(function (myData) {
        console.log(myData);

        let scatter_svg = d3.select("#chart2")        //creates an SVG element in the body
            .append("svg")
            .attr("width", width + margin)
            .attr("height", height + margin);
        
        myData.forEach((d) => console.log(Date.parse(d.Time.substring(10,18))));
        
        //consider converting lap time stamp into constituent parts
        //not agreeing with Date.parse in current form
        let timeConverter = (d) => {
            let lapTime = d.Time.substring(10,18);
            let periods = lapTime.split(":");

            return {
                mins: parseInt(periods[0]),
                secs: parseInt(periods[1]),
                ms: parseInt(periods[2]),
                totalms: parseInt(periods[0])*60*100 + parseInt(periods[1])*100 + parseInt(periods[2]),
                speed: d.Speed
            }
        }

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

        d3.select("scatter_svg")
            .selectAll("circle")
            .data(myData)
            .enter().append("circle")
            .style("fill", "black")
            .attr("cx", function (d) {
                return xMid + xMid * (d.X / xMax);
            })
            .attr("cy", function (d) {
                return yMid + yMid * (d.Y / yMax);
            })
            .attr("r", 2);
    });
