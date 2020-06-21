import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'

declare function require(path: string): any

const App: React.FC = ({}) => {
  const textbox = React.useRef<HTMLInputElement>(undefined);

  const countRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '5';
    textbox.current = element;
  }, []);

  const onCreate = React.useCallback(() => {
      const count = parseInt(textbox.current.value, 10);
      parent.postMessage({pluginMessage: {type: 'create-rectangles', count}}, '*');
  }, []);

  const onCancel = React.useCallback(() => {
      parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
  }, []);

  const OnTest = React.useCallback(() => {
    parent.postMessage({pluginMessage: {type: 'test'}}, '*');
  }, []);

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
        const { type, message } = event.data.pluginMessage;
        if (type === 'create-rectangles') {
            console.log(`Figma Says: ${message}`);
        };
    }
  }, []);

  return (
    <div>
      <img src={require('./logo.svg')} />
      <h2>Rectangle Creator</h2>
      <p>Count: <input ref={this.countRef} /></p>
      <button id="create" onClick={this.onCreate}>Create</button>
      <button id="create" onClick={this.onCreate}>Create</button>
      <button onClick={this.OnTest}>Test</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react-page'))