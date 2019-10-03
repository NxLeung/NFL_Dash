import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import "../playerResultRow.css";
// import { Select } from "react-select";

export default class PlayerResultRow extends PureComponent {
  static propTypes = {
    title: PropTypes.string
  };

  render() {
    return (
      <div
        onClick={() => this.props.onSelect(this.props.title)}
        className="component-player-result-row copy-to-clipboard"
      >
        <span className="title">{this.props.title}</span>
      </div>
    );
  }
}
