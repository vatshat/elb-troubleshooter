/* 
import consoleLog from './consoleLog'
import path from 'path'
*/

class App extends React.Component {
    state = {
        test: "React testing",
    }

    tensorflowHandler = this.tensorflowHandler.bind(this);

    tensorflowHandler() {
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
                <pre onClick={this.tensorflowHandler} id="test2">
                    {this.state.test}
                </pre>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('container'));
