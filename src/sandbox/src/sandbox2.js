/* 
import consoleLog from './consoleLog'
import path from 'path'
*/

class App extends React.Component {
    state = {
        test: "React testing",
    }

    onClickHandler = this.onClickHandler.bind(this);

    onClickHandler() {
        this.setState({test:"test direct es6 injection in script"});
        /* 
            window.tensorflow().then(prediction => {
                this.setState({test: JSON.stringify(prediction)});
            });

         */
    }

    render() {        
        return (
            <div>
                <pre onClick={this.onClickHandler} id="test2">
                    {this.state.test}
                </pre>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('container'));
