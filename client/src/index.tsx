import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  return <div>!!Hello, world!!</div>;
};

const rootElem = document.getElementById('root');

if (rootElem) {
  const root = ReactDOM.createRoot(rootElem);
  root.render(<App />);
}
