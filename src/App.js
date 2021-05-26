'use strict';

const React = require('react');

const {Header} = require('./Header');
const {Body} = require('./Body');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchFailed: false,
      suites: [],
      dashboard: null,
    };
  }

  render() {
    const { fetchFailed, dashboard, suites } = this.state;
    return (
      <React.Fragment>
        <Header fetchFailed={fetchFailed} dashboard={dashboard}/>
        <Body fetchFailed={fetchFailed} suites={suites}/>
      </React.Fragment>
    );
  }

  compareSuites(a, b) {
    if (a.name == 'core') {
      return -1;
    } else if (a.name == 'core' && b.name != 'core') {
      return -1;
    } else if (a.name == 'extra' && b.name == 'core') {
      return 1;
    } else if (a.name == 'extra' && b.name != 'core') {
      return -1;
    } else {
      return 1;
    }
  }

  loadDashboard() {
    const url = '/api/v0/dashboard';

    fetch(url).then((response) => {
      if (!response.ok) {
        this.setState({fetchFailed: true});
        throw new Error(response.statusText);
      }
      return response.json();
    }).then((data) => {
      this.setState({dashboard: data});
    }).catch((error) => {
      console.log(error);
      this.setState({fetchFailed: true});
    });
  }

  componentDidMount() {
    this.loadDashboard()

    const url = '/api/v0/pkgs/list';

    fetch(url).then((response) => {
      if (!response.ok) {
        this.setState({fetchFailed: true});
        throw new Error(response.statusText);
      }
      return response.json();
    }).then((data) => {
      const suites = {};

      for (let pkg of data) {
        if (pkg.suite in suites) {
          suites[pkg.suite].push(pkg);
        } else {
          suites[pkg.suite] = [pkg];
        }
      }

      const suiteList = [];

      for (let repo of Object.keys(suites)) {
        suiteList.push({name: repo, pkgs: suites[repo]});
      }

      suiteList.sort(this.compareSuites);

      this.setState({suites: suiteList});
    }).catch((error) => {
      console.log(error);
      this.setState({fetchFailed: true});
    });
  }
}

module.exports = {App};

// vim: ts=2 sw=2 et:
