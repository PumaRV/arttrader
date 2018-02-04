import React, { Component } from 'react';
import GoogleChart from './GoogleChart';
import axios from 'axios';

class TicksChart extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sentiment: 'flat'
    };
  }
  
  async pollData(pair) {
    const api = axios.create({
      baseURL: 'http://fxticks.com/',
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });
    
    //let data = await api.get('/ticks/' + this.props.pair + '/10');
    let last = await api.get('/last/' + this.props.pair);
    let dataArray = this.state.data;
    
    dataArray[dataArray.length - 1] = [last.open_time, last.low, last.open, last.close, last.high, last.ema20];
    this.setState({ data: dataArray});
    this.forceUpdate();
  }
  
  async componentDidMount() {
    const api = axios.create({
      baseURL: 'http://fxticks.com/',
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });
    
    let data = await api.get('/ticks/' + this.props.pair + '/10');
    let last = await api.get('/last/' + this.props.pair);
    
    data = data.data;
    last = last.data;
    
    const dataArray = [];
    data.forEach((element) => {
      const open = element.open;
      const close = element.close;
      const high = element.high;
      const low = element.low;
      var time = element.open_time;
      var ema20 = element.ema20;
      time = new Date(time);
      time = time.getHours() + ':0' + time.getMinutes();
      const item = [time, low, open, close, high, ema20];      
      dataArray.push(item);
    });
    
    dataArray.push([last.open_time, last.low, last.open, last.close, last.high, last.ema20]);
    
    this.setState({ data: dataArray});
    console.log(last.open + ' - ' + last.ema20);
    if(last.close < last.ema20) {
      console.log('bear');
      this.setState({ sentiment: 'bear' });
    } 
    
    if(last.open > last.ema20) {
      console.log('bull');
      this.setState({ sentiment: 'bull' });
    }
    
    setInterval(() => {
      this.pollData(this.props.pair);
    }, 6000);
  }
    
  render() {
     var options = {
          legend: 'none',
          candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
            risingColor: { strokeWidth: 0, fill: '#4286f4' }   // blue
          },
         seriesType: 'candlesticks',
         series: {1: {type: 'line'}}
        };

    let img = '';
    if(this.state.sentiment == 'bear') {
      img = '/images/bears.svg';
    }
    if(this.state.sentiment == 'bull') {
      img = '/images/bulls.svg';
    }
    
    var iconStyle = {
      display: 'inline-block',
      'margin-top': '-20px',
      'margin-left': '10px'
    };
    
    var titleStyle = {
      display: 'inline-block'
    };
    
    return(
      <div className="col-md-6">
        <h1 style={titleStyle}> {this.props.pair} </h1>
        <img src={img} width="35" height="35" style={iconStyle} />
        <hr/>
        <GoogleChart type="combo" data={this.state.data} options={options} />
      </div>
    )  
  }
  
}

export default TicksChart;