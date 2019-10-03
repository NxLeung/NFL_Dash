import React, { Component } from "react";
import * as d3 from "d3";

const width = 900;
const height = 600;
const margin = { top: 20, right: 40, bottom: 60, left: 50 };
const red = "#eb6a5b";
const blue = "#52b6ca";
const green = "#106b21";

class LineChart extends Component {
  state = {
    passing_yards_gained: null, // svg path command for all the pass temps
    rushing_yards_gained: null, // svg path command for rush temps,
    receiving_yards_gained: null,
    // d3 helpers
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    yScale2: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    lineGenerator: d3.line()
  };

  xAxis = d3
    .axisBottom()
    .scale(this.state.xScale)
    .tickFormat(d3.timeFormat("%Y"))
    .ticks(d3.timeYear);
  yAxis = d3
    .axisLeft()
    .scale(this.state.yScale)
    .tickFormat(d => d);
  // .attr("fill", "red");

  yAxis2 = d3
    .axisRight()
    .scale(this.state.yScale2)
    .tickFormat(d => d);

  yAxisLabel = d3
    .select(this.state.yAxis)
    .append("text")
    // .attr("x", 0)
    // .attr("y", 0)
    .text("Label Test");

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const { data } = nextProps;
    const { xScale, yScale, yScale2, lineGenerator } = prevState;

    // data has changed, so recalculate scale domains
    const timeDomain = d3.extent(data, d => d.year);
    const passMax = d3.max(data, d => d.pass);
    const rushMax = d3.max(data, d => d.rush);
    const receiveMax = d3.max(data, d => d.receive);

    xScale.domain(timeDomain);
    yScale.domain([0, passMax]);

    if (rushMax > receiveMax) {
      yScale2.domain([0, rushMax]);
    } else {
      yScale2.domain([0, receiveMax]);
    }
    // calculate line for rushing_yards_gained
    lineGenerator.x(d => xScale(d.year));
    lineGenerator.y(d => yScale2(d.rush));

    const rushing_yards_gained = lineGenerator(data);

    // and then passing_yards_gained
    lineGenerator.y(d => yScale(d.pass));
    const passing_yards_gained = lineGenerator(data);

    // and then receiving_yards_gained
    lineGenerator.y(d => yScale2(d.receive));
    const receiving_yards_gained = lineGenerator(data);

    return {
      rushing_yards_gained,
      passing_yards_gained,
      receiving_yards_gained
    };
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
    d3.select(this.refs.yAxis2).call(this.yAxis2);
  }

  render() {
    return (
      <svg width={width} height={height}>
        <path
          d={this.state.passing_yards_gained}
          fill="none"
          stroke={red}
          strokeWidth="2"
        />
        <path
          d={this.state.rushing_yards_gained}
          fill="none"
          stroke={blue}
          strokeWidth="2"
        />
        <path
          d={this.state.receiving_yards_gained}
          fill="none"
          stroke={green}
          strokeWidth="2"
        />
        <g>
          <g
            ref="xAxis"
            transform={`translate(0, ${height - margin.bottom})`}
          />

          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
          <g ref="yAxisLabel" transform={`translate(100, 300)`} />
          <g ref="yAxis2" transform={`translate(${width - margin.right}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default LineChart;
