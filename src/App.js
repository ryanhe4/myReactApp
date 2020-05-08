import React, {Component} from 'react';

import axios from 'axios';
import FileSaver from 'file-saver';
import storage from './lib/storage';

class App extends Component {
    state = {
        url: '',
    };

    webcommu = async () => {
        //local Storage Confirm
        const dateString = storage.get('__DATE_STRING__');
        if (!dateString) {
            console.log('없음!');
            storage.set('__DATE_STRING__', {dateString: 0});
        } else {
            console.log(dateString);
        }
        var tempString;

        try {
            const data = await axios.post('/api/v1.0/crawler/getlink', {
                uri: this.state.url,
                dateString: '2020-05-08 00:08:00',//dateString || 0,
            });

            this.simple(data.data);
            //local Storage set
            console.log(data.data['dateString']);
            storage.set('__DATE_STRING__', {dateString: data.data['dateString']});
        } catch (e) {
            console.error(e);
        }
    };

    simple = (Data) => {

        const file = new File([JSON.stringify(Data, null, 2)], 'file.txt',
            {type: 'text/plain;charset=utf-8'});
        FileSaver.saveAs(file);
    };

    inputChange = (e) => {
        this.setState({
            url: e.target.value,
        });
    };

    render() {
        return (
            <div className="App">
                URL 입력
                <input onChange={this.inputChange} id="inputbox"/>
                <button onClick={this.webcommu}> 확인</button>
            </div>
        );
    }
}

export default App;