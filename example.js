//U99350821
// Load CSV data and create visualization
d3.csv("mock_stock_data.csv").then(function(data) {
    // Convert strings to numbers and dates
    data.forEach(function(d) {
        d.date = new Date(d.date); // Convert date string to Date object
        d.value = +d.value; // Convert value string to number
    });

    // Set up dimensions and margins
    const width = 600;
    const height = 600;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    // Create SVG container
    const svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);

    // Add axes
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right]);
    const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);
    const yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Add line
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    // Draw initial line chart
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add interactivity - hover effect
    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.value))
        .attr("r", 5)
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>Value:</strong> ${d.value}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}).catch(function(error) {
    console.error("Error loading data:", error);
});
