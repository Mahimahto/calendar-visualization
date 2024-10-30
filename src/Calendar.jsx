import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const Calendar = ({ data }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [staticTooltip, setStaticTooltip] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null); // New state for hovered cell

  useEffect(() => {
    const width = 500;
    const cellSize = 60;
    const height = cellSize * 7 + 70;

    d3.select("#calendar").selectAll("svg").remove();

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

    const monthStart = d3.timeMonth(currentMonth);
    const monthEnd = d3.timeMonth.offset(monthStart, 1);
    const daysInMonth = d3.timeDays(monthStart, monthEnd);

    const processedData = d3.rollups(
      data,
      (v) => v.length,
      (d) => d3.timeFormat("%Y-%m-%d")(new Date(d.date))
    );

    const colorScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d[1] || 0)])
      .range(["#add8e6", "#00008b"]);

    const tooltip = d3.select("#calendar").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "10px")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.15)")
      .style("width", "220px")
      .style("font-size", "14px")
      .style("font-family", "Arial, sans-serif")
      .style("z-index", "10");

    svg.selectAll(".weekday")
      .data(weekdays)
      .enter().append("text")
      .attr("class", "weekday")
      .attr("x", (d, i) => i * cellSize)
      .attr("y", 20)
      .text(d => d)
      .attr("font-size", "16px")
      .attr("fill", "#333")
      .style("font-weight", "bold");

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
          const tooltipContent = blogPosts.map(post => `<li><a href="${post.slug}" target="_blank" style="color: #add8e6; text-decoration: none;">${post.title}</a></li>`).join("");
          tooltip.html(`<b>${blogPosts.length} post${blogPosts.length > 1 ? 's' : ''} on ${formattedDate}</b><ul>${tooltipContent}</ul>`)
                 .style("visibility", "visible")
                 .style("top", `${d3.pointer(event, this)[1] - 10}px`)
                 .style("left", `${d3.pointer(event, this)[0] + 10}px`);

          setHoveredCell(formattedDate); // Set the hovered cell
        } else {
          tooltip.style("visibility", "hidden");
        }
      })
      .on("mouseleave", function () {
        // Do not hide tooltip if staticTooltip is set
        if (!staticTooltip) tooltip.style("visibility", "hidden");
        setHoveredCell(null); // Clear the hovered cell state
      })
      .on("click", function (event, d) {
        const formattedDate = d3.timeFormat("%Y-%m-%d")(d);
        const blogPosts = data.filter(post => d3.timeFormat("%Y-%m-%d")(new Date(post.date)) === formattedDate);

        if (blogPosts.length) {
          const tooltipContent = blogPosts.map(post => `<li><a href="${post.slug}" target="_blank" style="color: #add8e6; text-decoration: none;">${post.title}</a></li>`).join("");
          tooltip.html(`<b>${blogPosts.length} post${blogPosts.length > 1 ? 's' : ''} on ${formattedDate}</b><ul>${tooltipContent}</ul>`)
                 .style("visibility", "visible")
                 .style("top", `${d3.pointer(event, this)[1] - 10}px`)
                 .style("left", `${d3.pointer(event, this)[0] + 10}px`);
          setStaticTooltip({ date: formattedDate }); // Set static tooltip on click
        }
      });

    const handleClickOutside = (e) => {
      if (staticTooltip && !e.target.closest(".tooltip") && !e.target.closest(".day")) {
        setStaticTooltip(null);
        tooltip.style("visibility", "hidden");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      tooltip.remove();
    };

  }, [currentMonth, data, staticTooltip]);

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
