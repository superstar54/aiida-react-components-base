// tests/BandsPdosPlot.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import BandsPdosPlot from '../src/components/widgets/BandsPdosPlot';

describe('BandsPdosPlot', () => {
  it('shows no data message when no props', () => {
    render(<BandsPdosPlot />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });
});
