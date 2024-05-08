import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import BankAccounts from './components/BankAccounts';
import TaxAccounts from './components/TaxAccounts';
import TransferForm from './components/TransferForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">Test Bank</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/bank-accounts">Bank Accounts</Nav.Link>
            <Nav.Link as={Link} to="/tax-accounts">Tax Accounts</Nav.Link>
            <Nav.Link as={Link} to="/transfer">Transfer</Nav.Link>
          </Nav>
        </Navbar>

        <main className="m-2">
          <Routes>
            <Route path="/bank-accounts" element={<BankAccounts />} />
            <Route path="/tax-accounts" element={<TaxAccounts />} />
            <Route path="/transfer" element={<TransferForm />} />
            <Route path="/" element={<BankAccounts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;