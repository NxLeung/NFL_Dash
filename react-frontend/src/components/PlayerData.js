import React, { Component } from "react";
import * as d3 from "d3";
import axios from "axios";

class GetData extends Component {
  state = {
    error: null,
    isLoaded: false,
    items: []
  };

  componentDidMount() {
    axios.get("http://localhost:5000/data/${selectedOption}").then(data => {
      let playerData = data;
      var parseTime = d3.timeParse("%Y");
      playerData.forEach(function(data) {
        data.year = parseTime(data.game_year);
        data.passing_yards_gained = +data.passing_yards_gained;
        data.receiving_yards_gained = +data.receiving_yards_gained;
        data.rushing_yards_gained = +data.rushing_yards_gained;
      })=>{

      this.setState({
        isLoaded: true,
        items: playerData
      }),
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }};
    });
  }

  // render(){
  //   return(playerData)
  // }

  render() {
    const { error, isLoaded, playerData } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {playerData.map(item => (
            <li>
              {item.passing_yards_gained}: {item.rushing_yards_gained}
            </li>
          ))}
        </ul>
      );
    }
  }
}

// //  extra code
//   constructor(props) {
//       super(props);
//       this.state = {
//         selectedOption: this.props.selectedOption
//       };
//     }

//     componentDidMount() {
//       this.drawChart(this.props.selectedOption);
//     }

//     componentDidUpdate(prevProps, prevState) {
//       if (this.props.selectedOption !== prevProps.selectedOption) {
//         this.setState({ selectedOption: this.props.selectedOption });
//         d3.select("#BarChart").remove();
//         this.drawChart(this.props.selectedOption);
//         console.log(this.state.selectedOption);
//         console.log("second");
//         console.log(this.props.selectedOption);
//       }
//     }

//     d3.json(`http://localhost:5000/data/${selectedOption}`).then(function(
//         data
//       ) {
//         let playerData = data;
//         var parseTime = d3.timeParse("%Y");
//         playerData.forEach(function(data) {
//           data.year = parseTime(data.game_year);
//           data.passing_yards_gained = +data.passing_yards_gained;
//           data.receiving_yards_gained = +data.receiving_yards_gained;
//           data.rushing_yards_gained = +data.rushing_yards_gained;
//         });
//         plot_chart(playerData);
//       });

//     render() {
//       return (playerData)
//     }
//   }

//   export default playerData;
