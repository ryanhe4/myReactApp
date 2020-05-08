import React, {Component} from "react";

class ContactInfo extends Component {
    render() {
        return (
            <div>
                {this.props.contact.name} {this.props.contact.phone}
            </div>
        );
    }
}

export default ContactInfo;