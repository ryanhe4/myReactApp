import React, {Component} from 'react';
import axios from 'axios';

class App extends Component {
  state = {
    url: '',
    email: '',
    run: false,
    emails: [],
  };

  inputChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  handleUrlButtonClick = async () => {
    const {url} = this.state;

    const checkUrl = await axios.post('/api/v1.0/crawler/check', {url});
    console.log(checkUrl);

    if (checkUrl.data.exists) {
      this.setstate({
        emails: checkUrl.data.emails,
        run:true,
      });
    }
  };

  render() {
    const printlist = this.state.emails.map(
        item => {
          return (
              <div>
                {item}
              </div>
          );
        },
    );

    return (
        <div className="App">
          <h2> URL 입력 </h2>
          <input onChange={this.inputChange} id="url"/>
          <button onClick={this.handleUrlButtonClick}> 불러오기</button>
          <hr/>
          <h2> 이메일 리스트 </h2>
          {
            this.state.run && (
                <input placeholder={'이메일'} onChange={this.inputChange}
                       id="email"/>
            )
            && (
                {printlist}
            )
          }
        </div>
    );
  }
}

export default App;