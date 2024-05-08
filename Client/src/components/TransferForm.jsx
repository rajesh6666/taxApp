import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function TransferForm() {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [taxAccounts, setTaxAccounts] = useState([]);
    const [sourceAccount, setSourceAccount] = useState('');
    const [targetAccount, setTargetAccount] = useState('');
    const [amount, setAmount] = useState('');

    const [sourceAccountError, setSourceAccountError] = useState('');
    const [targetAccountError, setTargetAccountError] = useState('');
    const [amountError, setAmountError] = useState('');

    const [apiSuccess, setApiSuccess] = useState('');
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        // Fetch the bank accounts and tax accounts from an API
        fetch('http://localhost:5001/BankAccounts')
            .then(response => response.json())
            .then(data => setBankAccounts(data));

        fetch('http://localhost:5001/TaxAccounts')
            .then(response => response.json())
            .then(data => setTaxAccounts(data));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Reset error messages
        setSourceAccountError('');
        setTargetAccountError('');
        setAmountError('');

        // Reset success and error messages
        setApiSuccess('');
        setApiError('');

        // Validate the form
        let isValid = true;

        // these validations can also be added in frontend
        // if (sourceAccount === '') {
        //     setSourceAccountError('Please select a source account.');
        //     isValid = false;
        // }

        // if (targetAccount === '') {
        //     setTargetAccountError('Please select a target account.');
        //     isValid = false;
        // }

        // if (amount <= 0) {
        //     setAmountError('Amount must be greater than 0.');
        //     isValid = false;
        // }

        // If the form is not valid, stop here
        if (!isValid) {
            return;
        }

        // Make a POST request to transfer the money
        fetch('http://localhost:5001/BankAccounts/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sourceAccountId: sourceAccount,
                targetAccountId: targetAccount,
                amount: amount,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    // If the response was not ok, throw an error with the message
                    return response.json().then(data => {
                        if (data.status === 'error') {
                            // If the status is 'error', throw an error with the message
                            throw new Error(data.message);
                        } else if (data.errors) {
                            // when validations fail in the backend, the response will have a 'title' property
                            throw new Error(data.title);
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                // If the status is 'success', show a success message
                setApiSuccess('Transfer successful');
            })
            .catch(error => {
                // Set the error message to the apiError state variable
                setApiError(error.message);
            });
    };

    return (
        <Form onSubmit={handleSubmit} data-testid="transfer-form">
            <Form.Group controlId="sourceAccount" className="mt-3">
                <Form.Label>Source Account</Form.Label>
                <Form.Control as="select" value={sourceAccount} onChange={e => {
                    setSourceAccount(e.target.value);
                    if (e.target.value !== '') {
                        setSourceAccountError('');
                    }
                }}>
                    <option value="">Select account</option>
                    {bankAccounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                </Form.Control>
                {sourceAccountError && <div className="text-danger">{sourceAccountError}</div>}
            </Form.Group>

            <Form.Group controlId="targetAccount" className="mt-3">
                <Form.Label>Target Account</Form.Label>
                <Form.Control as="select" value={targetAccount} onChange={e => {
                    setTargetAccount(e.target.value);
                    if (e.target.value !== '') {
                        setTargetAccountError('');
                    }
                }}>
                    <option value="">Select account</option>
                    {taxAccounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                </Form.Control>
                {targetAccountError && <div className="text-danger">{targetAccountError}</div>}
            </Form.Group>

            <Form.Group controlId="amount" className="mt-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" value={amount} onChange={e => {
                    setAmount(e.target.value);
                }} />
                {amountError && <div className="text-danger">{amountError}</div>}
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
                Transfer
            </Button>

            {apiSuccess && <div className="text-success">{apiSuccess}</div>}
            {apiError && <div className="text-danger">{apiError}</div>}
        </Form>
    );
}

export default TransferForm;