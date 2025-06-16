const { createRoot } = ReactDOM;

const App = () => {
  return <div>Hello Edwin!</div>;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

createRoot(rootElement).render(<App />);
