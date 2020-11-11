'use strict';

const React = require('react');
import Collapsible from 'react-collapsible'

function StatusSection(props) {
  const isOpen = props.open;
  const content = (
    <ul>
    {props.pkgs.map(function(pkg) {
      let url=`https://www.archlinux.org/packages/${pkg.suite}/${pkg.architecture}/${pkg.name}`;
      let links='';
      if (pkg.build_id) {
        let build_log_url=`/api/v0/builds/${pkg.build_id}/log`;
        let diffoscope_url=`/api/v0/builds/${pkg.build_id}/diffoscope`;
        links=<span className="noselect"> <a href={build_log_url} title="build log"><img src="icons/note-16.svg" className="icon" /></a> <a href={diffoscope_url} title="diffoscope"><img src="icons/search-16.svg" className="icon" /></a></span>;
      }
      return <li key={pkg.name}><p className="subtitle is-6"><a href={url}>{pkg.name} {pkg.version}</a>{links}</p></li>
    })}
    </ul>
  );
  const label = `${props.label} (${props.pkgs.length})`;
  return (
    <div className={ props.label }>
    { isOpen
      ? <Collapsible trigger={label} lazyRender open>{ content }</Collapsible>
      : <Collapsible trigger={label} lazyRender>{ content }</Collapsible>
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
    const name = `${suite.name} (${suite.pkgs.length})`;
    return (
      <section key={suite.name} className="section pt-4 pb-4" id={ suite.name }>
        <div className="tile box has-background-info">
          <Collapsible trigger={ name } open>
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
