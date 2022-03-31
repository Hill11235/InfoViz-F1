
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
        totalSec: parseInt(periods[0])*60 + parseInt(periods[1]),
        speed: +d.Speed
    }
}

d3.csv(datapath, timeConverter)
    .then(function (myData) {

        let timeExtent = d3.extent((d) => d.totalSec);
        let xScale = d3.scaleLinear()
                            .domain(timeExtent)
                            .range([0, width]);
        
        let speedExtent = d3.extent((d) => d.Speed);
        let yScale = d3.scaleLinear()
                            .domain(speedExtent)
                            .range([0, height]);

        let x_axis = d3.axisBottom(xScale);
        let y_axis = d3.axisLeft(yScale);

        let scatter_svg = d3.select("#chart2")        //creates an SVG element in the body
            .append("svg")
            .attr("width", width + margin)
            .attr("height", height + margin);
    });
