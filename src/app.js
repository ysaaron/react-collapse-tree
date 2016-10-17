import React from 'react';
import ReactDOM from 'react-dom';

import CollapseTreeZoom from './components/CollapseTreeZoom';
import data from './data/mock.json';

ReactDOM.render(<CollapseTreeZoom source={data} />, document.getElementById('app'));
