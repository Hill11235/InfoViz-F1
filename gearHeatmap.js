
d3.csv(datapath)
    .then(function (myData) {

        let svg_gear = d3.select("#chart2")        //creates an SVG element
            .append("svg")
            .attr("id", "gearSVG")
            .attr("width", width + margin)
            .attr("height", height + margin);

        //convert X and Y attributes back to integers
        myData.forEach(function (d) {
            d.X = +d.X;
            d.Y = +d.Y;
            d.nGear = +d.nGear;
        });

        let xMax = d3.max(myData, (d) => d.X);
        let yMax = d3.max(myData, (d) => d.Y);
        let gearMax = d3.max(myData, (d) => d.nGear);
		const gearScale = d3.scaleOrdinal()
									.domain([1, gearMax])
									.range(["gold","green","orange","blue","purple","red","pink","brown"]);

        var toolTip2 = d3.select("#chart2")
            .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "2px");
        
        d3.select("#gearSVG")
            .selectAll("circle")
            .data(myData)
            .enter().append("circle")
            .style("fill", (d) => gearScale(d.nGear))
            .attr("cx", function (d) {
                return xMid + xMid * (d.X / xMax);
            })
            .attr("cy", function (d) {
                return yMid + yMid * (d.Y / yMax);
            })
            .attr("r", 2)
            .on("mouseenter", function(event, d){
                d3.select(this)
                    .style("fill", "#000000");
                toolTip2.style("visibility", "visible")
                       .style("top", (event.pageY)+"px").style("left",(event.pageX)+"px")
                       .html("<p>Gear: " + d.nGear +" </p>");
            })
            .on("mouseout", function(event, d){
                d3.select(this)
                    .style("fill", (d) => gearScale(d.nGear));
                toolTip2.style("visibility", "hidden");
            });
    });
