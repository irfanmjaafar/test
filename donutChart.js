// power generation today
// value should be automated as respective fuel while all is total for the day

d3.csv("current-powe-gen.csv", function(data){
    var totalPower = 0; 
    let today2 = [];
    let halfHourAgo = [];
    let yesterday = [];
    for (var i = 0; i < data.length; i++){
        usageNow = Number(data[i].currentUsage);
        totalPower += usageNow
        //insert all d3 code here
        var eachFuelToday = {};
        eachFuelToday["fuelType"] = data[i].fuelType;
        eachFuelToday["currentPercentage"] = Number(data[i].currentPercentage);
        eachFuelToday["currentUsage"] = Number(data[i].currentUsage);

        var eachFuelHalfHour = {};
        eachFuelHalfHour["fuelType"] = data[i].fuelType;
        eachFuelHalfHour["halfHourPercentage"] = Number(data[i].halfHourPercentage);
        eachFuelHalfHour["halfHourUsage"] = Number(data[i].halfHourUsage);

        var eachFuelYesterday= {};
        eachFuelYesterday["fuelType"] = data[i].fuelType;
        eachFuelYesterday["twentyFourPercentage"] = Number(data[i].twentyFourHourPercentage);
        eachFuelYesterday["twentyFourHourUsage"] = Number(data[i].twentyFourHourUsage);

        today2.push(eachFuelToday);
        halfHourAgo.push(eachFuelHalfHour);
        yesterday.push(eachFuelYesterday);
    }
    console.log(today2);
    console.log(typeof(today2[0]["currentPercentage"]))
    console.log(typeof(totalPower));
    let num = (Math.round((today2[0]["currentUsage"] / totalPower) * 100)).toString() + '%';
    console.log(num);
    // console.log(halfHourAgo);
    // console.log(yesterday);

    
    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;
    var color = d3.scaleOrdinal()
    .range(["#5A39AC", "#DD98D6", "#E7C820", "#08B2B2", "#999D34", 
            "#BEE9C0", "#23541C", "#993366", "E6CDB3", "#4D4619", 
            "#C29B47", "#172D45", "#B281D5", "#C7C757", "#C757B8", 
            "#C9B45E", "#CDEED6", "#422F8E", "#63321"]);
    
    var svg = d3.select('#donut')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');
    
    var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);
    
    var pie = d3.pie()
    .value(function (d) {
        return d.currentPercentage;
    })
    .sort(null);
    
    var legendRectSize = 13;
    var legendSpacing = 7;
    
    var donutTip = d3.select("body").append("div")
    .attr("class", "donut-tip")
    .style("opacity", 0);
    
    var path = svg.selectAll('path')
    .data(pie(today2))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d, i) {
        return color(d.data.fuelType);
    })
    .attr('transform', 'translate(0, 0)')
    .on('mouseover', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.85');
        donutTip.transition()
            .duration(50)
            .style("opacity", 1);
            let num = (Math.round((today2[i]["currentUsage"] / totalPower) * 100)).toString() + '%';
        donutTip.html(num)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
    
    })
    .on('mouseout', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
        donutTip.transition()
            .duration('50')
            .style("opacity", 0);
    });
    
    
    var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'circle-legend')
    .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = height * color.domain().length / 2;
        var horz = -2 * legendRectSize - 13;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });
    
    legend.append('circle')
    .style('fill', color)
    .style('stroke', color)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', '.5rem');
    
    legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) {
        return d;
    });
    
    function change(data) {
    var pie = d3.pie()
        .value(function (d) {
            return d.currentPercentage;
            
        }).sort(null)(data);
    
    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;
    
    path = d3.select("#donut")
        .selectAll("path")
        .data(pie); // Compute the new angles
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
    path.transition().duration(500).attr("d", arc); // redrawing the path with a smooth transition
    }
    
    d3.select("button#dayb4yesterday")
    .on("click", function () {
        change(today2);
    })
    d3.select("button#women")
    .on("click", function () {
        change(yesterday);
    })
    d3.select("button#men")
    .on("click", function () {
        change(halfHourAgo)
    })
    }      
    );