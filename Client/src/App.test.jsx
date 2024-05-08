import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('App', () => {

  beforeEach(() => {
    fetchMock.doMock();
  });

  test('Should render App', async () => {
    const mockBankAccounts = JSON.stringify([{ id: '1', name: 'Bank Account 1' }, { id: '2', name: 'Bank Account 2' }]);
    fetchMock.mockOnce(mockBankAccounts);

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Test Bank')).toBeInTheDocument();
  });

  test('navigation links are in the document', async () => {
    const mockBankAccounts = JSON.stringify([{ id: '1', name: 'Bank Account 1' }, { id: '2', name: 'Bank Account 2' }]);
    fetchMock.mockOnce(mockBankAccounts);

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Bank Accounts')).toBeInTheDocument();
    expect(screen.getByText('Tax Accounts')).toBeInTheDocument();
  });
});