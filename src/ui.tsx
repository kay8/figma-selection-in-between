import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

declare function require(path: string): any;

const App: React.FC = () => {
  const onSelect = React.useCallback(() => {
    parent.postMessage({ pluginMessage: { type: 'select' } }, '*');
  }, []);

  const onCancel = React.useCallback(() => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  }, []);

  return (
    <div>
      <img src={require('./logo.svg')} />
      <h2 className="content-title">SelectionInBetween</h2>
      <p className="description">Select elements between the 2 selections</p>
      <div className="cta-group">
        <button className="button__action mr16" onClick={onSelect}>
          Select
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
