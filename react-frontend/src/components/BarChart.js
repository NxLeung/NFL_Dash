import React, { Component } from "react";
import * as d3 from "d3";
import chroma from "chroma-js";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };
const red = "#eb6a5b";
const green = "#b6e86f";
const blue = "#52b6ca";
const colors = chroma.scale([blue, green, red]).mode("hsl");

class BarChart extends Component {
  state = {
    bars: [], // array of rects
    // d3 helpers
    // xTimeScale: d3
    //   .scaleTime()
    //   .domain(d3.extent(data, d => d.year))
    //   .range([0, width]),

    // yLinearScale1: d3
    //   .scaleLinear()
    //   .domain([0, d3.max(data, d => d.passing_yards_gained)])
    //   .range([height, 0]),

    // yLinearScale2: d3
    //   .scaleLinear()
    //   // .domain([0, d3.max(playerData, d => d.receiving_yards_gained)])
    //   .domain([
    //     d3.min(data, data => data.receiving_yards_gained),
    //     d3.max(data, data => data.rushing_yards_gained)
    //   ])
    //   .range([height, 0])
    passing_yards_gained: null, // svg path command for all the pass temps
    rushing_yards_gained: null, // svg path command for rush temps,
    receiving_yards_gained: null,

    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    colorScale: d3.scaleLinear()
  };

  // bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
  // leftAxis = d3.axisLeft(yLinearScale1);
  // rightAxis = d3.axisRight(yLinearScale2);

  xAxis = d3
    .axisBottom()
    .scale(this.state.xScale)
    .tickFormat(d3.timeFormat("%Y"));
  yAxis = d3
    .axisLeft()
    .scale(this.state.yScale)
    .tickFormat(d => `${d} yds`);

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const { data } = nextProps;
    const { xScale, yScale, colorScale } = prevState;

    // data has changed, so recalculate scale domains
    const timeDomain = d3.extent(data, d => d.year);
    const yardMax = d3.max(data, d => d.pass);
    const colorDomain = d3.extent(data, d => d.pass);
    xScale.domain(timeDomain);
    yScale.domain([0, yardMax]);
    colorScale.domain(colorDomain);

    // calculate x and y for each rectangle
    // const bars = data.map(d => {
    //   const y1 = yScale(d.high);
    //   const y2 = yScale(d.low);
    //   return {
    //     x: xScale(d.date),
    //     y: y1,
    //     height: y2 - y1,
    //     fill: colors(colorScale(d.avg))
    //   };
    // });

    return { bars };
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    return (
      <svg width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect
            key={i}
            x={d.x}
            y={d.y}
            width="2"
            height={d.height}
            fill={d.fill}
          />
        ))}
        <g>
          <g
            ref="xAxis"
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default BarChart;
