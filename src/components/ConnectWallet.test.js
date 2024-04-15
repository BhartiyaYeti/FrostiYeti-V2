import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import ConnectWallet from './ConnectWallet';

describe('ConnectWallet', () => {
  it('renders the component and checks for button presence and click', () => {
    const mockConnectMetamask = jest.fn();
    render(<ConnectWallet connectMetamask={mockConnectMetamask} />);

    // Check that the text 'Edbucks' is in the document
    expect(screen.getByText('Edbucks')).toBeInTheDocument();

    // Check that the button is in the document and clickable
    const button = screen.getByRole('button', { name: /connect to metamask/i });
    expect(button).toBeInTheDocument();

    // Simulate a button click and verify that the provided function is called
    fireEvent.click(button);
    expect(mockConnectMetamask).toHaveBeenCalled();
  });
});
