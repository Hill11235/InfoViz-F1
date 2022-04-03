function clearSectorTimesChart() {
    var svg = d3.select("#d3Id")
    svg.selectAll("*").remove();
}

function populateSectorTimesChart() {
    var svg = d3.select("#d3Id"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#003f5c", "#bc5090", "#ffa600"]);

    d3.csv("data/"+ raceName + "/LEC_"+ raceName+"_Lap_Data.csv").then((data) => {
        data.forEach(function (d) {
            data.columns.forEach(function (e) {
                if (d[e] === "") {
                    d[e] = "0 days 00:00:00.00000"
                }
            })
        });

        let sectorData = data.map(function (d) {
            let one = d.Sector1Time.replace('0 days ', '').split(':')
            let oneSeconds = (+one[0]) * 60 * 60 + (+one[1]) * 60 + (+one[2]);
            let two = d.Sector2Time.replace('0 days ', '').split(':')
            let twoSeconds = (+two[0]) * 60 * 60 + (+two[1]) * 60 + (+two[2]);
            let three = d.Sector3Time.replace('0 days ', '').split(':')
            let threeSeconds = (+three[0]) * 60 * 60 + (+three[1]) * 60 + (+three[2]);
            return {
                LapNumber: d.LapNumber,
                "Sector One": oneSeconds,
                "Sector Two": twoSeconds,
                "Sector Three": threeSeconds
            }
        });

        data = sectorData.slice(lapNumber - 1, lapNumber);
        var keys = Object.keys(data[0]).slice(1);
        x0.domain(data.map(function (d) {
            return d.LapNumber;
        }));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function (d) {
            return d3.max(keys, function (key) {
                return d[key];
            });
        })]).nice();

        g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + x0(d.LapNumber) + ",0)";
            })
            .selectAll("rect")
            .data(function (d) {
                return keys.map(function (key) {
                    return {key: key, value: d[key]};
                });
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x1(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x1.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("fill", function (d) {
                return z(d.key);
            });

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Time(s)");

        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) {
                return d;
            });
    });
}
populateSectorTimesChart();
