function clearTyrePerformance() {
    var svg = d3.select("#tyre-performance-chart")
    svg.selectAll("*").remove();
}

function drawTyrePerformance() {
    let toolTip = d3.select("#chart1")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "2px");

    d3.csv("data/" + raceName + "/LEC_" + raceName + "_Lap_Data.csv")
        .then(function (data) {
            let myData = data.map(function (d) {
                return {
                    LapNumber: d.LapNumber,
                    SpeedST: d.SpeedST,
                    Compound: d.Compound,
                    TyreLife: d.TyreLife
                }
            });
            let tyreData = []
            let previousTyreChange = 0
            let tyreLife = 0;

            myData.forEach(function (d) {
                tL = parseInt(d.TyreLife)
                if (parseInt(d.LapNumber) == numberOfLaps) {
                    let x = myData.slice(previousTyreChange, d.LapNumber)
                    tyreData.push(x)
                }
                if (tL > tyreLife) {
                    tyreLife = tL
                } else {
                    let x = myData.slice(previousTyreChange, d.LapNumber)
                    tyreData.push(x)
                    previousTyreChange = d.LapNumber
                    tyreLife = d.TyreLife;
                }
            });
            var svg = d3.select("#tyre-performance-chart"),
                marginTp = 200,
                widthTp = svg.attr("width") - marginTp,
                heightTp = svg.attr("height") - marginTp

            var xScaleTp = d3.scaleLinear().domain([0, numberOfLaps]).range([0, widthTp]),
                yScaleTp = d3.scaleLinear().domain([50, 350]).range([heightTp, 0]);

            var g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");

            // Step 5
            // Title
            svg.append('text')
                .attr('x', widthTp / 2 + 100)
                .attr('y', 100)
                .attr('text-anchor', 'middle')
                .style('font-family', 'Helvetica')
                .style('font-size', 20)
                .text('Tyre Performance Across Laps');

            // X label
            svg.append('text')
                .attr('x', widthTp / 2 + 100)
                .attr('y', heightTp - 15 + 150)
                .attr('text-anchor', 'middle')
                .style('font-family', 'Helvetica')
                .style('font-size', 12)
                .text('Lap Number');

            // Y label
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('transform', 'translate(60,' + heightTp + ')rotate(-90)')
                .style('font-family', 'Helvetica')
                .style('font-size', 12)
                .text('Average Lap Speed (mph)');

            g.append("g")
                .attr("transform", "translate(0," + heightTp + ")")
                .call(d3.axisBottom(xScaleTp));

            g.append("g")
                .call(d3.axisLeft(yScaleTp));

            let datasets = [];
            tyreData.forEach(function (value, index, array) {
                let dataset = []
                value.forEach(function (d) {
                        if (d.SpeedST !== "" && d.LapNumber <= lapNumber) {
                            dataset.push([parseInt(d.LapNumber), parseFloat(d.SpeedST)])
                        }
                    }
                )
                datasets.push(dataset)
            })

            let colors = ["gold", "green", "orange", "blue", "purple", "red", "pink", "brown"]
            let i = 0;

            datasets.forEach(function (dataset) {
                svg.append('g')
                    .selectAll("dot")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) {
                        return xScaleTp(d[0]);
                    })
                    .attr("cy", function (d) {
                        return yScaleTp(d[1]);
                    })
                    .attr("r", 2)
                    .attr("transform", "translate(" + 100 + "," + 100 + ")")
                    .style("fill", colors[i])
                    .on("mouseenter", function (event, d) {
                            d3.select(this)
                                .style("fill", "#000000")
                        toolTip.style("visibility", "visible")
                            .style("top", (event.pageY) + "px").style("left", (event.pageX) + "px")
                            .html("<p> Tyre Compound: " + "Intermediate"  + "<br>Tyre Life: " + "</p>");
                        }
                    )
                    .on("mouseout", function (event, d) {
                            d3.select(this)
                                .style("fill","gold" )
                        toolTip.style("visibility", "hidden");
                        }
                    );

                var line = d3.line()
                    .x(function (d) {
                        return xScaleTp(d[0]);
                    })
                    .y(function (d) {
                        return yScaleTp(d[1]);
                    })
                    .curve(d3.curveMonotoneX)

                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line")
                    .attr("transform", "translate(" + 100 + "," + 100 + ")")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("stroke", colors[i])
                    .style("stroke-width", "2");
                i+= 1;
            })
        });
}

drawTyrePerformance()