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
    const height = cellSize * 7 + 50;

    // Weekdays names
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const svg = d3.select("#calendar")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid #ccc")
      .style("border-radius", "10px")
      .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)")
      .style("background", "#f9f9f9")
      .append("g")
      .attr("transform", "translate(20, 40)");

    const parseDate = d3.timeParse("%Y-%m-%d");
    const monthStart = d3.timeMonth(new Date(2024, 10));
    const monthEnd = d3.timeMonth.offset(monthStart, 1);
    
    const daysInMonth = d3.timeDays(monthStart, monthEnd);

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
      .style("border-radius", "4px")
      .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)");

    // Add Weekdays Names
    svg.selectAll(".weekday")
      .data(weekdays)
      .enter().append("text")
      .attr("class", "weekday")
      .attr("x", (d, i) => i * cellSize)
      .attr("y", -10)
      .text(d => d)
      .attr("font-size", "14px")
      .attr("fill", "#333")
      .style("font-family", "Arial, sans-serif")
      .style("font-weight", "bold");

    // Draw the calendar grid
    svg.selectAll(".day")
      .data(daysInMonth)
      .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", (d, i) => (d.getDay() === 0 ? 6 : d.getDay() - 1) * cellSize) // Monday as first day
      .attr("y", (d, i) => Math.floor(i / 7) * cellSize + 20)
      .attr("fill", d => {
        const blogPost = processedData.find(post => d3.timeDay(post.date).getTime() === d.getTime());
        return blogPost ? "#add8e6" : "white";
      })
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        const blogPost = processedData.find(post => d3.timeDay(post.date).getTime() === d.getTime());
        if (blogPost) {
          tooltip.style("visibility", "visible")
            .html(`<b>${blogPost.title}</b><br>Date: ${blogPost.date}`);
          d3.select(this).transition().duration(200).attr("fill", "#ff9933");
        }
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
        d3.select(this).transition().duration(200).attr("fill", d => {
          const blogPost = processedData.find(post => d3.timeDay(post.date).getTime() === d.getTime());
          return blogPost ? "#add8e6" : "white";
        });
      });

  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px", fontFamily: "Arial, sans-serif", color: "#333" }}>My Calendar</h1>
      <div id="calendar"></div>
    </div>
  );
};

export default Calendar;
