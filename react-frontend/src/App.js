// import React from "react";
// import logo from "./logo.svg";
import React, { PureComponent } from "react";
// import logo from "./logo.svg";
import "./App.css";
// import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import SearchInput from "./components/searchInput";
import PlayerResults from "./components/PlayerResults";
import filterPlayer from "./components/filterPlayer";
import SummaryTable from "./components/SummaryTable";
import axios from "axios";
import * as d3 from "d3";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <p>My Token = {window.token}</p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

export default class App extends PureComponent {
  state = {
    selectedOption: "E.Manning"
  };

  constructor(props) {
    super(props);
    this.state = {
      filteredPlayer: filterPlayer("", 30),
      selectedOption: "E.Manning",
      playerData: {}
    };
  }

  callAPI() {
    let selectedOption = this.state.selectedOption;
    axios.get(`http://localhost:5000/data/${selectedOption}`).then(data => {
      const parseTime = d3.timeParse("%Y");
      let playerData = data.data;
      playerData.forEach(function(data) {
        data.year = parseTime(data.game_year);
        data.pass = +data.passing_yards_gained;
        data.receive = +data.receiving_yards_gained;
        data.rush = +data.rushing_yards_gained;
      });
      this.setState({ playerData: playerData });
    });
  }

  componentDidMount() {
    // let selectedOption = this.state.selectedOption;
    // axios.get(`http://localhost:5000/data/${selectedOption}`).then(data => {
    //   const parseTime = d3.timeParse("%Y");
    //   let playerData = data.data;
    //   playerData.forEach(function(data) {
    //     data.year = parseTime(data.game_year);
    //     data.pass = +data.passing_yards_gained;
    //     data.receive = +data.receiving_yards_gained;
    //     data.rush = +data.rushing_yards_gained;
    //   });
    //   this.setState({ playerData: playerData });
    this.callAPI();
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedOption !== prevState.selectedOption) {
      this.callAPI();
    }
  }

  handleSelect = selectedOption => {
    this.setState({ selectedOption });
    // this.callAPI();
    // console.log(this.state.selectedOption);
    // <SummaryTable {this.state} />
    // <BarChart {this.props.selectedOption}/>
    // if (this.state.selectedOption) {
    //   // const fields = this.state.fields.map(field => (
    //   <BarChart selectedOption={this.state.selectedOption} />;
    //   // ));
    // }
  };

  handleSearchChange = event => {
    this.setState({
      filteredPlayer: filterPlayer(event.target.value, 20)
    });
  };

  render() {
    const data = this.state.playerData;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky" id="sidebar">
              <SearchInput textChange={this.handleSearchChange} />
              <PlayerResults
                playerData={this.state.filteredPlayer}
                onSelect={this.handleSelect.bind(this)}
              />
            </div>
          </div>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div className="chartjs-size-monitor">
              <div className="chartjs-size-monitor-expand"></div>
              <div className="chartjs-size-monitor-shrink"></div>
            </div>
            {/* <div className="row">
              <div className="col-sm-12">
                <SummaryTable id="summary" {...this.state} />
                <h2>Summary Statistics for {this.state.selectedOption}</h2>
              </div>
              <div className="col-sm-4">
                <div className="table-responsive" id="summary-table"></div>
                <h2 className="h2">Player Performance over Time</h2>
              </div>
            </div> */}

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
              <div
                className="my-4 chartjs-render-monitor"
                id="chartbox"
                width="622"
                height="262"
              >
                <SummaryTable data={data} {...this.state} />
                <LineChart data={data} />
                {/* <BarChart data={data} /> */}

                {/* <BarChart id="BarChart" ref="BarChart" {...this.state} /> */}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
