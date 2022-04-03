let timeConverter = (d) => {
    let lapTime = d.Time.substring(10,18);
    let periods = lapTime.split(":");

    return {
        mins: parseFloat(periods[0]),
        secs: parseFloat(periods[1]),
        totalSec: parseFloat(periods[0])*60 + parseFloat(periods[1]),
        Speed: +d.Speed,
        nGear: +d.nGear,
        Throttle: +d.Throttle
        //DistanceToDriverAhead: parseFloat(d.DistanceToDriverAhead)
    }
}

d3.csv(datapath, timeConverter)
    .then((myData) => {

        //dropdown options
        var data = ["Speed", "nGear", "Throttle", "DistanceToDriverAhead"];
        let selectValue = d3.select('select').property('value');
        
        d3.select('#dropDownMenu')
                .on("mouseout", updateLine);

        let timeExtent = d3.max(myData, (d) => +d.totalSec);
        let xScale = d3.scaleLinear()
                            .domain([0, timeExtent])
                            .range([0, width]);
        
        let speedMax = d3.max(myData, (d) => d.Speed);
        let yScale = d3.scaleLinear()
                            .domain([0, speedMax])
                            .range([height, 50]);

        let x_axis = d3.axisBottom(xScale);
        let y_axis = d3.axisLeft(yScale);

        let scatter_svg = d3.select("#chart3")        //creates an SVG element in the body
            .append("svg")
            .attr("id", "lineSVG")
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
                                .y((d) => yScale(d[selectValue]));


        function updateLineTitle(title) {
            d3.select("#lineSVG")
                .append("text")
                .attr("id", "chartTitle")
                .attr("x", (width / 2))
                .attr("y", 16)
                .attr("text-anchor", "middle")
                .style("fill", "black")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text(title + " at given time")
        }
        updateLineTitle("Speed")
        
        scatter_svg.append("path")
                            .datum(myData)
                            .attr("class", "line")
                            .attr("id", "myPath")
                            .attr("fill", "none")
                            .attr("stroke", "green")
                            .attr("d", lineGenerator);
        
        function updateLine() {
            let selectValue = d3.select('select').property('value');
            d3.select("#lineSVG").selectAll("*").remove();
            updateLineTitle(selectValue);

            let speedMax = d3.max(myData, (d) => d[selectValue]);
            let yScale = d3.scaleLinear()
                            .domain([0, speedMax])
                            .range([height, 50]);
            
            let y_axis = d3.axisLeft(yScale);

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
                            .y((d) => yScale(d[selectValue]));

            scatter_svg.append("path")
                            .datum(myData)
                            .attr("class", "line")
                            .attr("id", "myPath")
                            .attr("fill", "none")
                            .attr("stroke", "green")
                            .attr("d", lineGenerator);
        }
    });
