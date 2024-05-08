import { render, screen, waitFor } from '@testing-library/react';
import TaxAccounts from './TaxAccounts';

describe('TaxAccounts', () => {

    test('renders table with account data', async () => { // Make the test function async
        // Mock the response from the API
        const mockAccounts = [
            { name: 'Account 1', balance: 100 },
            { name: 'Account 2', balance: 200 },
        ];
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockAccounts),
        });

        // Render the component
        render(<TaxAccounts />);

        // Wait for the data to be loaded
        await waitFor(() => screen.getAllByText('Account 1'));

        const accountRows = await waitFor(() => screen.getAllByRole('row'));

        // Verify that the table is rendered with the correct data
        expect(accountRows).toHaveLength(mockAccounts.length + 1); // +1 for the table header row

        mockAccounts.forEach((account, index) => {
            const row = accountRows[index + 1]; // Skip the header row
            expect(row).toHaveTextContent((index + 1).toString());
            expect(row).toHaveTextContent(account.name);
            expect(row).toHaveTextContent(account.balance.toString());
        });

        // Restore the original fetch function
        global.fetch.mockRestore();
    });

});