import React from 'react';

import CollapseTreeZoom from './CollapseTreeZoom';
import data from '../data/mock.json';

class Main extends React.Component {
  render() {
    return (
      <CollapseTreeZoom source={data} />
    );
  }
}

export default Main;
