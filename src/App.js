import React, {Component} from 'react';

import axios from 'axios';
import FileSaver from 'file-saver';
import storage from './lib/storage';

class App extends Component {
  state = {
    url: '',
    check: false,
    isEmailSend: false,
    email: '',
    email2: '',
    email3: '',
    run: false,
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
    if (this.state.check === true) {
      console.log('파일 다운로드 후 다시 시도 해주세요.');
      return;
    }

    const dateString = storage.get('__DATE_STRING__');
    if (!dateString) {
      console.log('저장된 date 없음');
      storage.set('__DATE_STRING__', {dateString: 0});
    }

    try {
      const check = await axios.post('/api/v1.0/crawler/getlink', {
        uri: this.state.url,
        dateString: dateString || 0,
        downLoad: 0,
      });

      if (check.data['check'] === true) {
        this.setState({
          check: true,
        });
        if (this.state.isEmailSend === false) {
          this.setState({
            isEmailSend: true,
          });
          //email 코드
          const {email, email2, email3} = this.state;
          const emailstring = email + ',' + email2 + ',' + email3;
          console.log(emailstring);
          await axios.post('/api/v1.0/crawler/sendemail',
              {emails: emailstring});
        }
      } else {
        console.log('다운로드 없음');
      }
      //local Storage set;
    } catch (e) {
      console.error(e);
    }
  };

  isEmptyObject = (param) => {
    return Object.keys(param).length === 0 && param.constructor === Object;
  };

  //check === true
  handleDownloadData = async () => {
    const dateString = storage.get('__DATE_STRING__');

    const data = await axios.post('/api/v1.0/crawler/getlink', {
      uri: this.state.url,
      dateString: dateString || 0,
      downLoad: 1,
    });

    this.clearfunc();
    const Data = data.data;

    try {
      const file = new File([JSON.stringify(Data, null, 2)], 'file.txt',
          {type: 'text/plain;charset=utf-8'});
      FileSaver.saveAs(file);
    } catch (e) {
      console.error(e);
    }
    storage.set('__DATE_STRING__', {dateString: data.data['dateString']});

    this.setState({
      check: false,
      isEmailSend: false,
    });
  };

  inputChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
        <div className="App">
          URL 입력
          <input onChange={this.inputChange} id="url"/>
          {
            !this.state.run &&
            (<button onClick={this.registerfunc}> 시작</button>)
          }
          {
            this.state.run && (<button onClick={this.clearfunc}> 중지</button>)
          }

          {
            this.state.check && (<div>
              <button onClick={this.handleDownloadData}> 다운로드</button>
            </div>)
          }
          {
            !this.state.check && (<div> 새로운 다운로드 없음</div>)
          }
          <input placeholder={'이메일1'} onChange={this.inputChange} id="email"/>
          <input placeholder={'이메일2'} onChange={this.inputChange} id="email2"/>
          <input placeholder={'이메일3'} onChange={this.inputChange} id="email3"/>
        </div>
    );
  }
}

export default App;