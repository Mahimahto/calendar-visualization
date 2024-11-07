import React, { useEffect } from 'react';
import * as d3 from 'd3';

const Calendar = ({ data }) => {
  // Determine start and end years based on the data
  const startYear = d3.min(data, d => new Date(d.date).getFullYear());
  const endYear = d3.max(data, d => new Date(d.date).getFullYear());
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).reverse();

  useEffect(() => {
    years.forEach((year) => {
      const width = 100;
      const cellSize = 15;
      const height = cellSize * 7 + 30;

      d3.select(`#calendar-${year}`).selectAll("svg").remove();

      const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const months = d3.timeMonths(new Date(year, 0, 1), new Date(year + 1, 0, 1));

      const processedData = d3.rollups(
        data,
        (v) => v.length,
        (d) => d3.timeFormat("%Y-%m-%d")(new Date(d.date))
      );

      const colorScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d[1] || 0)])
        .range(["#add8e6", "#00008b"]);

      const container = d3.select(`#calendar-${year}`);

      months.forEach((month) => {
        const monthStart = d3.timeMonth(month);
        const daysInMonth = d3.timeDays(monthStart, d3.timeMonth.offset(monthStart, 1));

        const svg = container
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("margin", "5px 10px")
          .append("g")
          .attr("transform", "translate(10, 30)");

        svg.append("text")
          .attr("x", width / 2)
          .attr("y", -10)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .text(d3.timeFormat("%B")(month));

        svg.selectAll(".weekday")
          .data(weekdays)
          .enter().append("text")
          .attr("class", "weekday")
          .attr("x", (d, i) => i * cellSize)
          .attr("y", 15)
          .text(d => d)
          .attr("font-size", "8px")
          .attr("fill", "#333");

        svg.selectAll(".day")
          .data(daysInMonth)
          .enter().append("rect")
          .attr("class", "day")
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("x", (d, i) => ((d.getDay() + 6) % 7) * cellSize)
          .attr("y", (d, i) => Math.floor((i + monthStart.getDay()) / 7) * cellSize + 25)
          .attr("fill", d => {
            const formattedDate = d3.timeFormat("%Y-%m-%d")(d);
            const blogPost = processedData.find(post => post[0] === formattedDate);
            return blogPost ? colorScale(blogPost[1]) : "#fff";
          })
          .attr("stroke", "#ccc")
          .attr("stroke-width", 1)
          .style("cursor", "pointer")
          .on("mouseenter", function (event, d) {
            const formattedDate = d3.timeFormat("%Y-%m-%d")(d);
            const blogPosts = data.filter(post => d3.timeFormat("%Y-%m-%d")(new Date(post.date)) === formattedDate);

            if (blogPosts.length) {
              const tooltip = d3.select("#calendar-container").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "#333")
                .style("color", "#fff")
                .style("padding", "5px")
                .style("border-radius", "4px")
                .style("visibility", "visible")
                .html(blogPosts.map(post => `<div>${post.title}</div>`).join(""));
              
              tooltip.style("top", `${event.pageY}px`).style("left", `${event.pageX}px`);
            }
          })
          .on("mouseleave", () => {
            d3.select(".tooltip").remove();
          });
      });
    });
  }, [data, years]);

  return (
    <div style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "blue" }}>
        <u>Yearly Calendars</u>
      </h1>
      <div id="calendar-container">
        {years.map(year => (
          <div key={year} style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ width: "60px", textAlign: "right", paddingRight: "10px", color: "blue", fontWeight: "bold", fontSize: "16px" }}>
              {year}
            </div>
            <div id={`calendar-${year}`} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", flex: 1 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
