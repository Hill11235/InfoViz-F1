
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
        
        let lineGenerator = d3.line()
                                .x((d) => margin + xScale(+d.totalSec))
                                .y((d) => yScale(d.speed));

        console.log(myData)
        scatter_svg.append("path")
                            .datum(myData)
                            .attr("class", "line")
                            .attr("d", lineGenerator);
    });
