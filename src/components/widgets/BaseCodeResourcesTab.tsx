import React, { useEffect, FC } from 'react';
import { Form } from 'react-bootstrap';
import CodeSelector, { CodeOption } from './CodeSelector';

export interface BaseCodeConfig {
  input_plugin?: string;
  label?: string;
  nodes?: number;
  cpus?: number;
  codeOptions?: CodeOption[];
  [key: string]: any;
}

export interface DataShape {
  codes: Record<string, BaseCodeConfig>;
}

export interface BaseCodeResourcesTabProps {
  /** default configuration for each codeKey */
  codesConfig: Record<string, BaseCodeConfig>;
  /** current form data */
  data: DataShape;
  /** callback to update the data */
  onDataChange: (newData: DataShape) => void;
  /** list of available codes from backend */
  codes?: Array<{
    attributes: { input_plugin: string };
    label: string;
    extras?: { computer: string };
  }>;
}

const BaseCodeResourcesTab: FC<BaseCodeResourcesTabProps> = ({
  codesConfig = {},
  data = { codes: {} },
  onDataChange,
  codes,
}) => {
  useEffect(() => {
    // Merge defaults + existing data
    const initialCodes: Record<string, BaseCodeConfig> = {
      ...codesConfig,
      ...data.codes,
    };

    Object.keys(codesConfig).forEach((codeKey) => {
      const cfg = codesConfig[codeKey];
      const existing = initialCodes[codeKey] || { ...cfg };

      // filter codeOptions by input_plugin
      const opts = codes
        ? codes.filter((c) => c.attributes.input_plugin === cfg.input_plugin)
        : [];

      initialCodes[codeKey] = {
        ...cfg,
        ...existing,
        codeOptions: opts,
      };
    });

    const newData = { codes: initialCodes };
    if (JSON.stringify(data.codes || {}) !== JSON.stringify(initialCodes)) {
      onDataChange(newData);
    }
  }, [codesConfig, data.codes, onDataChange, codes]);

  const handleCodeChange = (
    codeKey: string,
    field: keyof BaseCodeConfig,
    raw: string | number
  ) => {
    let value: string | number = raw;
    if (field === 'nodes' || field === 'cpus') {
      const n = typeof raw === 'string' ? parseInt(raw, 10) : raw;
      value = !isNaN(n) && n > 0 ? n : 1;
    }
    const updated = {
      ...data.codes,
      [codeKey]: {
        ...data.codes[codeKey],
        [field]: value,
      },
    };
    onDataChange({ codes: updated });
  };

  return (
    <Form>
      {Object.entries(data.codes).map(([codeKey, cfg]) => (
        <div key={codeKey} className="mb-4">
          <CodeSelector
            codeLabel={codeKey}
            codeValue={cfg.label ?? ''}
            onCodeChange={(v) => handleCodeChange(codeKey, 'label', v)}
            nodeValue={cfg.nodes ?? 1}
            onNodeChange={(v) => handleCodeChange(codeKey, 'nodes', v)}
            cpuValue={cfg.cpus ?? 1}
            onCpuChange={(v) => handleCodeChange(codeKey, 'cpus', v)}
            codeOptions={cfg.codeOptions ?? []}
          />
        </div>
      ))}
    </Form>
  );
};

export default BaseCodeResourcesTab;
