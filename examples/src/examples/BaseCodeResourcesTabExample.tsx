import React, { useState } from 'react';
import BaseCodeResourcesTab, {
  BaseCodeConfig,
  DataShape,
} from 'aiida-react-components-base/components/widgets/BaseCodeResourcesTab';  // ← drop the extra src/

import type { CodeOption } from 'aiida-react-components-base/components/widgets/CodeSelector';

export default function BaseCodeResourcesTabExample() {
  // default configuration for each code key
  const codesConfig: Record<string, BaseCodeConfig> = {
    pw: { input_plugin: 'pw.x', nodes: 1, cpus: 1 },
    qe: { input_plugin: 'qe.x', nodes: 2, cpus: 4 },
  };

  // simulate backend code list
  const codesList: Array<CodeOption & { attributes: { input_plugin: string } }> = [
    { label: 'pw.x', extras: { computer: 'localhost' }, attributes: { input_plugin: 'pw.x' } },
    { label: 'qe.x', extras: { computer: 'remote.cluster' }, attributes: { input_plugin: 'qe.x' } },
  ];

  // form data state
  const [data, setData] = useState<DataShape>({ codes: {} });

  return (
    <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 4 }}>
      <h2>BaseCodeResourcesTab</h2>
      <BaseCodeResourcesTab
        codesConfig={codesConfig}
        codes={codesList}
        data={data}
        onDataChange={setData}
      />
      <pre style={{ background: '#f5f5f5', padding: 8 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
