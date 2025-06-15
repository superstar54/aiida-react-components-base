import React, { useState } from 'react';
import StructureViewer from 'aiida-react-components-base/components/widgets/StructureViewer';
import type { Structure } from 'aiida-react-components-base/components/widgets/StructureViewer';

// Example “structure” object—replace with a real AiiDA structure export
const sampleStructure: Structure = {
  // minimal Atoms JSON shape:
  symbols: ['O','H','H'],
  positions: [
    [0, 0, 0],
    [0, 0, 1],
    [1, 0, 0]
  ],
  cell: [[5,0,0],[0,5,0],[0,0,5]],
};

export default function StructureViewerExample() {
  const [structure, setStructure] = useState<Structure>(sampleStructure);

  return (
    <div style={{ padding: 16 }}>
      <h2>StructureViewer</h2>
      <StructureViewer
        structure={structure}
        width={800}
        height={600}
        borderColor="#aaa"
      />
      {/* In a real demo you might switch between different structures */}
    </div>
  );
}
