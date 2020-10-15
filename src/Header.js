'use strict';

const React = require('react');


class Header extends React.Component {
  calculateSuiteStats(data) {
    let good = 0;
    let bad = 0;
    let unknown = 0;

    for (let pkg of data) {
      switch (pkg.status) {
        case 'GOOD':
          good++;
          break
        case 'BAD':
          bad++;
          break
        case 'UNKWN':
          unknown++;
          break
      }
    }

    const percentage = (good / data.length * 100).toFixed(1);
    return {good, bad, unknown, percentage};
  }

  render() {
    const {fetchFailed, suites } = this.props;
    const suitesStats = [];

    for (let suite of suites) {
      const {good, bad, unknown, percentage} = this.calculateSuiteStats(suite.pkgs);
      suitesStats.push({name: suite.name, good, bad, unknown, percentage});
    }

    const {good, bad, unknown, percentage} = this.calculateSuiteStats(suites.flatMap(suite => suite.pkgs));
    const overallStats = {name: 'overall', good, bad, unknown, percentage};

    return (
      <section className="hero is-primary">
      <div id="archnavbar">
        <div id="logo"><a href="https://archlinux.org" title="Return to the main page">Arch Linux</a></div>
        <div id="archnavbarmenu">
            <ul id="archnavbarlist">
              <li id="anb-home"><a href="https://archlinux.org" title="Arch news, packages, projects and more">Home</a></li>
              <li id="anb-packages"><a href="https://archlinux.org/packages/" title="Arch Package Database">Packages</a></li>
              <li id="anb-forums"><a href="https://bbs.archlinux.org/" title="Community forums">Forums</a></li>
              <li id="anb-wiki"><a href="https://wiki.archlinux.org/" title="Community documentation">Wiki</a></li>
              <li id="anb-bugs"><a href="https://bugs.archlinux.org/" title="Report and track bugs">Bugs</a></li>
              <li id="anb-security"><a href="https://security.archlinux.org/" title="Arch Linux Security Tracker">Security</a></li>
              <li id="anb-aur"><a href="https://aur.archlinux.org/" title="Arch Linux User Repository">AUR</a></li>
              <li id="anb-download"><a href="https://archlinux.org/download/" title="Get Arch Linux">Download</a></li>
            </ul>
          </div>
        </div>
        <div className="hero-body">
          <div id="status">
            <h1 className="title">Reproducible status</h1>
            <p>Welcome to the official experimental Arch Linux <a href="https://github.com/kpcyrd/rebuilderd">rebuilderd</a> instance, this page shows the results of verification builds of official Arch Linux packages in the repositories in an effort to be fully reproducible.</p>
            <p>For more information read the <a href="https://reproducible-builds.org/">Reproducible Builds website</a> or join the <a href="ircs://chat.freenode.net/archlinux-reproducible">#archlinux-reproducible</a> IRC channel on <a href="https://freenode.net/">Freenode</a>.</p>
            <br/>
            <ul className="repo-summary">
            {!fetchFailed && suites.length > 0 &&
            <li key="overall">Arch Linux is <span className="bold">{ overallStats.percentage }%</span> reproducible with <span className="bad bold">{ overallStats.bad } bad</span>  <span className="unknown bold">{ overallStats.unknown } unknown</span> and <span className="good bold">{ overallStats.good } good</span> packages.</li>
            }
            {!fetchFailed && suitesStats.map(function(repo, index) {
              return <li key={ index }><a href={"#" + repo.name }>[{ repo.name }]</a> repository is <span className="bold">{ repo.percentage }%</span> reproducible with <span className="bad bold">{ repo.bad } bad</span>  <span className="unknown bold">{ repo.unknown } unknown</span> and <span className="good bold">{ repo.good } good</span> packages.</li>;
            })}
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

module.exports = {Header};
