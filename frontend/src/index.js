import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import TicksChart from './TicksChart';
import registerServiceWorker from './registerServiceWorker';
import { Timeline } from 'react-twitter-widgets'

import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render( 
        <div>
            <Header />
            <div className="container-fluid">
              <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <TicksChart pair="BTCUSD" />
                      <TicksChart pair="ETHUSD" />
                      <TicksChart pair="LTCUSD" />
                    </div>
                  </div>
                  <div className="col-md-4">
                   <Timeline
                      dataSource={{
                        sourceType: 'likes',
                        screenName: 'FXTicks365'
                      }}
                      options={{
                        height: '750',
                        width: '600'
                      }}
                      onLoad={() => console.log('Timeline is loaded!')}
                    />
                  </div>
              </div>
            </div>
        </div>,
         document.getElementById('root')
    );

registerServiceWorker();