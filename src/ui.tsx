import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

declare function require(path: string): any;

const App: React.FC = () => {
  const textbox = React.useRef<HTMLInputElement | null>(null);

  const countRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '5';
    textbox.current = element;
  }, []);

  const onCreate = React.useCallback(() => {
    if (!textbox.current) return;
    const count = parseInt(textbox.current.value, 10);
    parent.postMessage(
      { pluginMessage: { type: 'create-rectangles', count } },
      '*'
    );
  }, []);

  const onCancel = React.useCallback(() => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  }, []);

  return (
    <div>
      <img src={require('./logo.svg')} />
      <h2>Rectangle Creator</h2>
      <p>
        Count: <input ref={countRef} />
      </p>
      <button className="button__action" onClick={onCreate}>
        Create
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
