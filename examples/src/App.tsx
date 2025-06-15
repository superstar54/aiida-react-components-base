// example/src/App.tsx

import React, { useState } from 'react';
import * as Examples from './examples';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  // Get the list of example component names
  const exampleKeys = Object.keys(Examples);
  // Track which example is currently selected
  const [selected, setSelected] = useState<string>(exampleKeys[0]);
  // Grab the component itself
  const SelectedExample = (Examples as any)[selected] as React.FC;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 200,
        borderRight: '1px solid #ddd',
        padding: '1rem',
        boxSizing: 'border-box'
      }}>
        <h2>Examples</h2>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{ width: '100%' }}
        >
          {exampleKeys.map((key) => (
            <option key={key} value={key}>
              {key.replace(/Example$/, '')}
            </option>
          ))}
        </select>
      </aside>

      {/* Main preview area */}
      <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <h1>{selected.replace(/Example$/, '')}</h1>
        <div style={{ marginTop: '1rem' }}>
          <SelectedExample />
        </div>
      </main>
    </div>
  );
}
