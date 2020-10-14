'use strict';

const React = require('react');
import Collapsible from 'react-collapsible'

function StatusSection(props) {
  const isOpen = props.open;
  const content = (
    <ul>
    {props.pkgs.map(function(pkg) {
      return <li key={pkg.name}><p className="subtitle is-6 has-text-white">{pkg.name} {pkg.version}</p></li>
    })}
    </ul>
  );
  return (
    <div>
    { isOpen
      ? <Collapsible trigger={props.label} lazyRender open>{ content }</Collapsible>
      : <Collapsible trigger={props.label} lazyRender>{ content }</Collapsible>
    }
    </div>
  );
}

class Section extends React.Component {
  render() {
    const { suite } = this.props;
    const good = suite.pkgs.filter(pkg => pkg.status == "GOOD");
    const bad = suite.pkgs.filter(pkg => pkg.status == "BAD");
    const unknown = suite.pkgs.filter(pkg => pkg.status == "UNKWN");
    return (
      <section key={suite.name} className="section pt-4 pb-4" id={ suite.name }>
        <div className="tile box has-background-danger">
          <Collapsible trigger={ suite.name } open>
            {good.length > 0 && <StatusSection label="good" pkgs={ good } />}
            {bad.length > 0 && <StatusSection label="bad" pkgs={ bad } open />}
            {unknown.length > 0 && <StatusSection label="unknown" pkgs={ unknown } open />}
          </Collapsible>
        </div>
      </section>
    )
  }
}

module.exports = {Section};
