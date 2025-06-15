// example/src/examples/CodeSelectorExample.tsx

import React, { useState } from 'react';
import { CodeSelector } from 'aiida-react-components-base';

export default function CodeSelectorExample() {
  const [code, setCode]   = useState('');
  const [nodes, setNodes] = useState(1);
  const [cpus, setCpus]   = useState(1);

  return (
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 4 }}>
      <h2>CodeSelector</h2>
      <CodeSelector
        codeLabel="Select Code"
        codeValue={code}
        nodeValue={nodes}
        cpuValue={cpus}
        codeOptions={[
          { label: 'pw.x', extras: { computer: 'localhost' } },
          { label: 'qe.x', extras: { computer: 'remote.cluster' } },
        ]}
        onCodeChange={setCode}
        onNodeChange={setNodes}
        onCpuChange={setCpus}
      />
    </div>
  );
}
