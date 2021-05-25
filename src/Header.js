'use strict';

const React = require('react');
import ArchLinuxNavbar from './navbar';


class Header extends React.Component {
  calculateSuiteStats(data) {
    let good = data['good'];
    let bad = data['bad'];
    let unknown = data['unknown'];

    const percentage = (good / (good + bad + unknown) * 100).toFixed(1);
    return {good, bad, unknown, percentage};
  }

  // TODO: this is duplciated code from App.js
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

  render() {
    const {fetchFailed, dashboard, suites } = this.props;
    const overall = {good: 0, unknown: 0, bad: 0};
    const suitesStats = [];

    if (dashboard) {
      for (const [key, value] of Object.entries(dashboard.suites)) {
        const {good, bad, unknown, percentage} = this.calculateSuiteStats(value);
        overall['good'] += good;
        overall['bad'] += bad;
        overall['unknown'] += unknown;
        suitesStats.push({name: key, good, bad, unknown, percentage});
      }
      suitesStats.sort(this.compareSuites);
    }

    const {good, bad, unknown, percentage} = this.calculateSuiteStats(overall);
    const overallStats = {name: 'overall', good, bad, unknown, percentage};

    return (
      <section className="hero is-primary">
        <ArchLinuxNavbar />
        <div className="hero-body">
          <div id="status">
            <h1 className="title">Reproducible status</h1>
            <p>Welcome to the official experimental Arch Linux <a href="https://github.com/kpcyrd/rebuilderd">rebuilderd</a> instance, this page shows the results of verification builds of official Arch Linux packages in the repositories in an effort to be fully reproducible.</p>
            <p>For more information read the <a href="https://reproducible-builds.org/">Reproducible Builds website</a> or join the <a href="ircs://irc.libera.chat/archlinux-reproducible">#archlinux-reproducible</a> IRC channel on <a href="https://libera.chat/">Libera Chat</a>.</p>
            <br/>
            <ul className="repo-summary">
            {!fetchFailed && !dashboard &&
            <p><b>Loading...</b></p>
            }
            {!fetchFailed && dashboard &&
            <li key="overall">Arch Linux is <span className="has-text-weight-bold">{ overallStats.percentage }%</span> reproducible with <span className="bad has-text-weight-bold">{ overallStats.bad } bad</span>  <span className="unknown has-text-weight-bold">{ overallStats.unknown } unknown</span> and <span className="good has-text-weight-bold">{ overallStats.good } good</span> packages.</li>
            }
            {!fetchFailed && suitesStats.map(function(repo, index) {
              return <li key={ index }><a href={"#" + repo.name }>[{ repo.name }]</a> repository is <span className="has-text-weight-bold">{ repo.percentage }%</span> reproducible with <span className="bad has-text-weight-bold">{ repo.bad } bad</span>  <span className="unknown has-text-weight-bold">{ repo.unknown } unknown</span> and <span className="good has-text-weight-bold">{ repo.good } good</span> packages.</li>;
            })}
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

module.exports = {Header};

// vim: ts=2 sw=2 et:
