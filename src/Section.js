'use strict';

const React = require('react');


class Section extends React.Component {
  render() {
    const { suite } = this.props;
    return (
      <section key={suite.name} id={suite.name} className="section">
        <div className="tile box has-background-danger">
          <div className="content">
            <p className='title is-5 has-text-white'>{ suite.name }</p>
              <ul>
              {suite.pkgs.map(function(pkg) { 
                if (pkg.status == 'BAD') {
                  return <li key={pkg.name}><p className="subtitle is-6 has-text-white">{pkg.name}-{pkg.version}</p></li>
                }
              })}
              </ul>
          </div>
        </div>
      </section>
    )
  }
}

module.exports = {Section};
