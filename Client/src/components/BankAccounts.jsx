import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

function BankAccounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/BankAccounts')
      .then(response => response.json())
      .then(data => setAccounts(data));
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr role='row'>
          <th>#</th>
          <th>Account Name</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account, index) => (
          <tr key={index} role='row'>
            <td>{index + 1}</td>
            <td>{account.name}</td>
            <td>{account.balance}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default BankAccounts;