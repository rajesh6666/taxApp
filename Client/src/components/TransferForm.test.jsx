import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TransferForm from './TransferForm';

describe('TransferForm', () => {

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test('renders TransferForm component', async () => {
        // Mock the API calls
        const mockBankAccounts = JSON.stringify([{ id: '1', name: 'Bank Account 1' }, { id: '2', name: 'Bank Account 2' }]);
        const mockTaxAccounts = JSON.stringify([{ id: '3', name: 'Tax Account 1' }, { id: '4', name: 'Tax Account 2' }]);

        fetchMock.mockResponseOnce(mockBankAccounts)
            .mockResponseOnce(mockTaxAccounts);

        await act(async () => {
            render(<TransferForm />);
        });
        const transferFormElement = screen.getByTestId('transfer-form');
        expect(transferFormElement).toBeInTheDocument();
    });

    test('displays success message if transfer is successful', async () => {
        // Mock the API calls
        const mockBankAccounts = JSON.stringify([{ id: '1', name: 'Bank Account 1' }, { id: '2', name: 'Bank Account 2' }]);
        const mockTaxAccounts = JSON.stringify([{ id: '3', name: 'Tax Account 1' }, { id: '4', name: 'Tax Account 2' }]);
        const mockTransferResponse = JSON.stringify({ status: 'success' });

        fetchMock.mockResponseOnce(mockBankAccounts)
            .mockResponseOnce(mockTaxAccounts)
            .mockResponseOnce(mockTransferResponse);

        await act(async () => {
            render(<TransferForm />);
        });
        const sourceAccountSelect = screen.getByLabelText('Source Account');
        const targetAccountSelect = screen.getByLabelText('Target Account');
        const amountInput = screen.getByLabelText('Amount');
        const transferButton = screen.getByText('Transfer');

        fireEvent.change(sourceAccountSelect, { target: { value: '1' } });
        fireEvent.change(targetAccountSelect, { target: { value: '2' } });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(transferButton);

        await waitFor(() => {
            const successMessageElement = screen.getByText('Transfer successful');
            expect(successMessageElement).toBeInTheDocument();
        });

    });

    test('displays error message if transfer fails', async () => {

        // Mock the API calls
        const mockBankAccounts = JSON.stringify([{ id: '1', name: 'Bank Account 1' }, { id: '2', name: 'Bank Account 2' }]);
        const mockTaxAccounts = JSON.stringify([{ id: '3', name: 'Tax Account 1' }, { id: '4', name: 'Tax Account 2' }]);
        const mockTransferResponse = JSON.stringify({ status: 'error', message: 'Transfer failed' });

        fetchMock.mockResponseOnce(mockBankAccounts)
            .mockResponseOnce(mockTaxAccounts)
            .mockResponseOnce(mockTransferResponse, { status: 400 });

        await act(async () => {
            render(<TransferForm />);
        });

        const sourceAccountSelect = screen.getByLabelText('Source Account');
        const targetAccountSelect = screen.getByLabelText('Target Account');
        const amountInput = screen.getByLabelText('Amount');
        const transferButton = screen.getByText('Transfer');

        fireEvent.change(sourceAccountSelect, { target: { value: '1' } });
        fireEvent.change(targetAccountSelect, { target: { value: '2' } });
        fireEvent.change(amountInput, { target: { value: '100' } });
        await act(async () => {
            fireEvent.click(transferButton);
        });

        await waitFor(() => {
            const errorMessageElement = screen.getByText('Transfer failed');
            expect(errorMessageElement).toBeInTheDocument();
        });

    });
});