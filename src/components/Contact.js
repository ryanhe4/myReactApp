import React, {Component} from "react";
import ContactInfo from "./ContactInfo";

class Contact extends Component {
    state = {
        keyword: '',
        contactData: [
            {name: 'a', phone: '010-0000-0001'},
            {name: 'b', phone: '010-0000-0002'},
            {name: 'c', phone: '010-0000-0003'},
            {name: 'd', phone: '010-0000-0004'}
        ]
    };

    handleChange = (e) => {
        this.setState({
            keyword: e.target.value
        });
    }
    render() {
        const mapToComponent = (data) => {
            data.sort();
            data = data.filter((contact) => {
                return contact.name.toLowerCase().indexOf(this.state.keyword) > -1;
            })
            return data.map((contact, i) => {
                return (<ContactInfo contact={contact} key={i}/>);
            });
        };
        return (
            <div>
                <h1>Contacts</h1>
                <input
                    name={"keyword"}
                    placeholder={"Search"}
                    value={this.state.keyword}
                    onChange={this.handleChange}/>
                <div>{mapToComponent(this.state.contactData)}</div>
            </div>
        );
    }
}

export default Contact;