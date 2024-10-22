import React, { useEffect } from 'react';
import * as d3 from 'd3';

const data = [
  { date: "2024-11-08", title: "Blog Post 1", slug: "/blog-post-1" },
  { date: "2024-11-08", title: "Blog Post 2", slug: "/blog-post-2" },
  { date: "2024-11-07", title: "Blog Post 3", slug: "/blog-post-3" },
  { date: "2024-11-06", title: "Blog Post 4", slug: "/blog-post-4" },
  { date: "2024-11-05", title: "Blog Post 5", slug: "/blog-post-5" }
];

const Calendar = () => {
  useEffect(() => {
    const width = 900;
    const cellSize = 50;
    const height = cellSize * 7 + 50; // 7 days in a week + padding

    const svg = d3.select("#calendar")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black")
      .append("g")
      .attr("transform", "translate(20, 40)");

    const parseDate = d3.timeParse("%Y-%m-%d");

    const processedData = data.map(d => ({
      ...d,
      date: parseDate(d.date)
    }));

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("border", "1px solid #000")
      .style("padding", "8px")
      .style("border-radius", "4px");

    svg.selectAll(".day")
      .data(processedData)
      .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", (d, i) => (i % 7) * cellSize)
      .attr("y", (d, i) => Math.floor(i / 7) * cellSize)
      .attr("fill", "lightblue")
      .attr("stroke", "white")
      .on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible")
          .html(`Title: ${d.title}<br>Date: ${d.date}`);
        d3.select(this).attr("fill", "orange");
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", "lightblue");
      });

    svg.selectAll(".text")
      .data(processedData)
      .enter().append("text")
      .attr("x", (d, i) => (i % 7) * cellSize + 10)
      .attr("y", (d, i) => Math.floor(i / 7) * cellSize + 25)
      .text(d => d.title)
      .attr("font-size", "12px")
      .attr("fill", "black");

  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>My Calendar</h1>
      <div id="calendar"></div>
    </div>
  );
};

export default Calendar;
