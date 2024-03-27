import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import 'bootstrap/dist/css/App.css';
import Routes from "./Routes.tsx";

function App() {
    return (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
          <Navbar.Brand className="fw-bold text-muted">Scratch</Navbar.Brand>
          <Navbar.Toggle />
        </Navbar>
        <Routes />
      </div>
    );
  }

export default App;