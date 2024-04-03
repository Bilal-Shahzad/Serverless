import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import 'bootstrap/dist/css/App.css';
import Routes from "./Routes.tsx";
import { LinkContainer } from "react-router-bootstrap";
import { useState } from "react";
import { AppContext, AppContextType } from "./lib/contextLib";


const [isAuthenticated, userHasAuthenticated] = useState(false);
function App() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold text-muted">Scratch</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
          {isAuthenticated ? (
    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
  ) : (
    <>
      <LinkContainer to="/signup">
        <Nav.Link>Signup</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/login">
        <Nav.Link>Login</Nav.Link>
      </LinkContainer>
    </>
  )}
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider
  value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
>
  <Routes />
</AppContext.Provider>
      <Routes />
    </div>
  );
}

export default App;