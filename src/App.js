import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

const getJSON = (url) => {
    return new Promise((res, rej) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status === 200 || status === 304) {
          res(xhr.response);
        } else {
          rej(xhr.response);
        }
      };
      xhr.send();
    })
};


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      bundles : []
    }
  }

  componentWillMount(){
    getJSON('http://localhost:3001/list-all-broadband')
      .then((data)=>{
        this.setState({ bundles: data })
      })
  }

  render() {
    let cards = this.state.bundles.map( (e,k) => {
      let name = e.bundle.reduce( (total, current, ci) => {
        return `${total}${ ci === 0 ? '' : ' + '}${current}`
      },'');

      return (
        <div className="melhor-plano__card" key={k}>
          <h4 className="melhor-plano__card-title">{ name }</h4>
          <span className="melhor-plano__card-price">R$ { e.price.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.") }</span>
          <button className="melhor-plano__card-subscribe"> Subscribe </button>
        </div>
      )
    });

    return (
      <div className="melhor-plano">
        <header className="melhor-plano__header">
          <img src={logo} className="melhor-plano__logo" alt="logo" />
          <h5 className="melhor-plano__title">Desafio Full Stack - Marvin</h5>
        </header>
        <div className="melhor-plano">
          <div className="melhor-plano__card-list">
            {cards}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
