import React from 'react';

import CollapseTreeZoom from './CollapseTreeZoom';
import data from '../data/mock.json';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <CollapseTreeZoom source={data} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
