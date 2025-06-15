// tests/CodeSelector.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CodeSelector from '../src/components/widgets/CodeSelector';

describe('CodeSelector', () => {
  const codeOptions = [
    { label: 'pw', extras: { computer: 'localhost' } },
    { label: 'qe', extras: { computer: 'remote.cluster' } },
  ];
  const onCodeChange = jest.fn();
  const onNodeChange = jest.fn();
  const onCpuChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <CodeSelector
        codeLabel="pw@localhost"
        codeValue=""
        nodeValue={1}
        cpuValue={2}
        codeOptions={codeOptions}
        onCodeChange={onCodeChange}
        onNodeChange={onNodeChange}
        onCpuChange={onCpuChange}
      />
    );
  });

  it('renders the label and selects', () => {
    expect(screen.getByText('Nodes')).toBeInTheDocument();
    // the default option
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('calls onCodeChange when selecting a code', () => {
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'pw@localhost' },
    });
    expect(onCodeChange).toHaveBeenCalledWith('pw@localhost');
  });

  it('calls onNodeChange and onCpuChange', () => {
    const [nodeInput, cpuInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(nodeInput, { target: { value: '3' } });
    fireEvent.change(cpuInput,  { target: { value: '4' } });
    expect(onNodeChange).toHaveBeenCalledWith(3);
    expect(onCpuChange).toHaveBeenCalledWith(4);
  });
});
