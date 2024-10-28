// src/Calendar.js
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const Calendar = ({ data }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 10)); // November 2024

  useEffect(() => {
    const width = 500;
    const cellSize = 60;
    const height = cellSize * 7 + 70;

    // Remove purana SVG
    d3.select("#calendar").selectAll("svg").remove();

    // Weekdays ke names
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const svg = d3.select("#calendar")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "2px solid #333")
      .style("border-radius", "12px")
      .style("box-shadow", "0 8px 16px rgba(0, 0, 0, 0.2)")
      .append("g")
      .attr("transform", "translate(20, 40)");

    const parseDate = d3.timeParse("%Y-%m-%d");
    const monthStart = d3.timeMonth(currentMonth);
    const monthEnd = d3.timeMonth.offset(monthStart, 1);
    const daysInMonth = d3.timeDays(monthStart, monthEnd);

    // Processed data with count of posts per day
    const processedData = d3.rollups(data, v => v.length, d => d3.timeDay(parseDate(d.date)));

    // Color scale to set intensity
    const colorScale = d3.scaleLinear()
      .domain([1, d3.max(processedData, d => d[1])]) // Min 1 post to max posts
      .range(["#add8e6", "#00008b"]); // Light blue to dark blue

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("border", "1px solid #333")
      .style("padding", "10px")
      .style("border-radius", "6px")
      .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)");

    // Weekdays names add karna
    svg.selectAll(".weekday")
      .data(weekdays)
      .enter().append("text")
      .attr("class", "weekday")
      .attr("x", (d, i) => i * cellSize)
      .attr("y", 20)
      .text(d => d)
      .attr("font-size", "16px")
      .attr("fill", "#333")
      .style("font-family", "Arial, sans-serif")
      .style("font-weight", "bold");

    // Calendar grid draw karna
    svg.selectAll(".day")
      .data(daysInMonth)
      .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", (d, i) => ((d.getDay() + 6) % 7) * cellSize)
      .attr("y", (d, i) => {
        const startWeekOffset = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
        return Math.floor((i + startWeekOffset) / 7) * cellSize + 30;
      })
      .attr("fill", d => {
        const blogPost = processedData.find(post => d3.timeDay(post[0]).getTime() === d.getTime());
        return blogPost ? colorScale(blogPost[1]) : "#fff";
      })
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        const blogPost = processedData.find(post => d3.timeDay(post[0]).getTime() === d.getTime());
        if (blogPost) {
          tooltip.style("visibility", "visible")
            .html(`<b>${blogPost[1]} posts</b><br>Date: ${d.toISOString().split('T')[0]}`);
          d3.select(this).transition().duration(200).attr("fill", "#ff9933");
        }
      })
      .on("mousemove", function (event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).transition().duration(200).attr("fill", d => {
          const blogPost = processedData.find(post => d3.timeDay(post[0]).getTime() === d.getTime());
          return blogPost ? colorScale(blogPost[1]) : "#fff";
        });
      });

  }, [currentMonth, data]);

  const prevMonth = () => {
    setCurrentMonth(d3.timeMonth.offset(currentMonth, -1));
  };

  const nextMonth = () => {
    setCurrentMonth(d3.timeMonth.offset(currentMonth, 1));
  };

  return (
    <div style={{ position: "relative", width: "520px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", fontFamily: "Arial, sans-serif", color: "Blue" }}><u>My Calendar</u></h1>
      <div id="calendar" style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "absolute", top: "15px", left: "20px", right: "20px", zIndex: "10" }}>
          <button onClick={prevMonth} style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}>{"<"}</button>
          <span style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            fontFamily: "Arial, sans-serif"
          }}>
            {d3.timeFormat("%B %Y")(currentMonth)}
          </span>
          <button onClick={nextMonth} style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
