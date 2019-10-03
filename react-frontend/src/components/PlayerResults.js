import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import PlayerResultRow from "./PlayerResultRow";
import "../playerResults.css";

export default class PlayerResults extends PureComponent {
  static propTypes = {
    playerData: PropTypes.array
  };

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { onSelect } = this.props;
    return (
      <div className="component-player-results">
        {this.props.playerData.map(playerData => (
          <PlayerResultRow
            key={playerData.title}
            title={playerData.title}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }
}
