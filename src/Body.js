'use strict';

const React = require('react');

const { Section } = require('./Section');


class Body extends React.Component {
  render() {
    const { fetchFailed, suites } = this.props;

    return (
      <React.Fragment>
      { fetchFailed &&
      <section className="section">
        <div className="tile box has-background-danger">
          <div className="content has-text-centered">
            <p className='title is-5 has-text-white'>An unexpected error occurred fetching the rebuild status</p>
          </div>
        </div>
      </section>
      }
      {suites.map(suite =>
        <Section key={suite.name} suite={suite}/>
      )}
      </React.Fragment>
    )
  }
}

module.exports = {Body};
