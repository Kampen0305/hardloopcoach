const { createRoot } = ReactDOM;

const App = () => {
  return <h1>Hello Edwin!</h1>;
};

const root = document.getElementById("root");
createRoot(root).render(<App />);
