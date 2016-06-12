require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

import CollapseTreeZoom from './CollapseTreeZoom';
import data from '../data/mock.json';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
        <CollapseTreeZoom source={data} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
