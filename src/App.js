import React, {Component} from 'react';

import axios from 'axios';
//import FileSaver from 'file-saver';
import storage from './lib/storage';

class App extends Component {
  state = {
    url: '',
    email: '',
    email2: '',
    email3: '',
    run: false,
    sendlist: [],
  };

  registerfunc = () => {
    //등록
    if (!this.state.loopRet) {
      this.handleCheckData();

      const loopRet = setInterval(this.handleCheckData, 1000 * 60 * 10);
      this.setState({
        loopRet,
        run: true,
      });
    }
  };
  clearfunc = () => {
    clearInterval(this.state.loopRet);

    this.setState({
      run: false,
      loopRet: '',
    });
  };

  handleCheckData = async () => {
    //local Storage Confirm
    const dateString = storage.get('__DATE_STRING__');

    if (!dateString) {
      console.log('저장된 date 없음');
      storage.set('__DATE_STRING__', {dateString: 0});
    }
    //email 코드
    const {email, email2, email3} = this.state;
    const emailstring = email + ',' + email2 + ',' + email3;

    console.log(emailstring);

    try {
      const check = await axios.post('/api/v1.0/crawler/getlink', {
        uri: this.state.url,
        dateString: dateString || 0,
        emails:emailstring,
      });

      if (check.data['check'] === true) {
        //local Storage set;
        storage.set('__DATE_STRING__', {dateString: check.data['dateString']});

        const {sendlist} = this.state;

        sendlist.push({
          no:check.data['dateString'],
        })

        this.setState({
          sendlist,
        })
      } else {
        console.log('새로운 데이터 없음');
      }
    } catch (e) {
      console.error(e);
    }
  };

  inputChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    const printlist = this.state.sendlist.map(
        item => {
          return(
            <div key={item.no}>
              {item.no}
            </div>
          )
        },
    );

    return (
        <div className="App">
          <h2> URL 입력 </h2>
          <input onChange={this.inputChange} id="url"/>
          {
            !this.state.run &&
            (<button onClick={this.registerfunc}> 시작</button>)
          }
          {
            this.state.run && (<button onClick={this.clearfunc}> 중지</button>)
          }
          <hr/>
          <h2> 이메일 입력 </h2>
          <input placeholder={'이메일1'} onChange={this.inputChange} id="email"/>
          <input placeholder={'이메일2'} onChange={this.inputChange} id="email2"/>
          <input placeholder={'이메일3'} onChange={this.inputChange} id="email3"/>
          <hr/>
          <h2> log </h2>
          {printlist}
        </div>
    );
  }
}

export default App;