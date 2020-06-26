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
      this.setState({
        emails: checkUrl.data.emails,
        run: true,
      });
    }
  };
  handleAddButtonClick = async () => {
    const {email, url} = this.state;

    const addEmail = await axios.post('/api/v1.0/crawler/addemail',
        {url, email});
    if (addEmail.data.success) {
      alert(`이메일 ${email} 추가 성공`);
      this.setState({
        emails: this.state.emails.push(email),
      });
    } else {
      alert('추가 실패!');
    }
  };

  render() {
    const emailList = this.state.emails.map((item, i) => {
      return (<div key={i}>
        {item}
      </div>);
    });
    return (
        <div className="App">
          <h2> URL 입력 </h2>
          <input onChange={this.inputChange} id="url"/>
          <button onClick={this.handleUrlButtonClick}> 불러오기</button>
          <hr/>
          <h2> 이메일 리스트 </h2>
          {
            this.state.run && (
                <div>
                  <input placeholder={'이메일'} onChange={this.inputChange}
                         id="email"/>
                  <button onClick={this.handleAddButtonClick}> 추가</button>
                  {emailList}
                </div>
            )
          }
        </div>
    );
  }
}

export default App;