import React from 'react';

/* https://stackoverflow.com/questions/248011/how-do-i-wrap-text-in-a-pre-tag 
   Internet Explorer 5.5+ 
*/

const preStyle = {
    wordWrap: 'normal'
};

export default class PreHeader extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <pre style={preStyle} className="col-lg-4">
                {JSON.stringify(this.props, null, 2)}
            </pre>
        );
    }
}
