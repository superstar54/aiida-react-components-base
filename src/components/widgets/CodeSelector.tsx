import React, { FC } from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

export interface CodeOption {
  label: string;
  attributes?: {
    input_plugin: string;
  };
  extras?: {
    computer: string;
  };
}

export interface CodeSelectorProps {
  codeLabel: string;
  codeValue: string;
  onCodeChange: (value: string) => void;
  nodeValue: number;
  onNodeChange: (value: number) => void;
  cpuValue: number;
  onCpuChange: (value: number) => void;
  codeOptions: CodeOption[];
}

const CodeSelector: FC<CodeSelectorProps> = ({
  codeLabel,
  codeValue,
  onCodeChange,
  nodeValue,
  onNodeChange,
  cpuValue,
  onCpuChange,
  codeOptions = [],
}) => {
  console.log('CodeSelector received codeOptions:', codeOptions);
  // use a generic ChangeEventHandler<any> so it matches react-bootstrap Form.Control's event type
  const handleCodeChange: React.ChangeEventHandler<any> = (e) => {
    onCodeChange(e.target.value);
  };

  const handleNodeChange: React.ChangeEventHandler<any> = (e) => {
    onNodeChange(Number(e.target.value));
  };

  const handleCpuChange: React.ChangeEventHandler<any> = (e) => {
    onCpuChange(Number(e.target.value));
  };

  return (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={2}>
        {codeLabel}:
      </Form.Label>

      <Col sm={4}>
        <Form.Control as="select" value={codeValue} onChange={handleCodeChange}>
          <option value="">-- Select a code --</option>
          {codeOptions.map((option) => {
            const display = `${option.label}@${option.extras?.computer ?? ''}`;
            return (
              <option key={display} value={display}>
                {display}
              </option>
            );
          })}
        </Form.Control>
      </Col>

      <Col sm={2}>
        <InputGroup>
          <InputGroup.Text>Nodes</InputGroup.Text>
          <Form.Control
            type="number"
            value={nodeValue}
            min={1}
            onChange={handleNodeChange}
          />
        </InputGroup>
      </Col>

      <Col sm={2}>
        <InputGroup>
          <InputGroup.Text>CPUs</InputGroup.Text>
          <Form.Control
            type="number"
            value={cpuValue}
            min={1}
            onChange={handleCpuChange}
          />
        </InputGroup>
      </Col>
    </Form.Group>
  );
};

export default CodeSelector;
