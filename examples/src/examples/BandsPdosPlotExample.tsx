import React, { useState } from 'react';
import BandsPdosPlot, {
  BandData,
  PdosData,
  PdosProjection
} from 'aiida-react-components-base/components/widgets/BandsPdosPlot';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BandsPdosPlotExample() {
  // 1) Generate k-path (Γ → X → M → Γ) over [0,1]
  const kPoints = 80;
  const x = Array.from({ length: kPoints }, (_, i) => i / (kPoints - 1));

  // 2) Build 6 bands with sinusoidal dispersion + offset
  const numBands = 6;
  const y: number[][] = Array.from({ length: numBands }, (_, b) =>
    x.map(k =>
      // band center shifts by (b - mid)*0.5, dispersion amplitude 0.3
      Math.sin((b + 1) * Math.PI * k) * 0.3 + (b - (numBands - 1)/2) * 0.5
    )
  );

  // Alternate spin index: 0 = up, 1 = down
  const band_type_idx = Array.from({ length: numBands }, (_, i) => i % 2);

  // Path labels at fractions along the k-axis
  const pathlabels: [string[], number[]] = [
    ['Γ', 'X', 'M', 'Γ'],
    [0, 0.33, 0.66, 1]
  ];

  const sampleBands: BandData = {
    x,
    y,
    band_type_idx,
    pathlabels,
    fermi_energy: 0  // set Fermi at 0 eV
  };

  // 3) Generate PDOS energy grid
  const ne = 300;
  const energy = Array.from({ length: ne }, (_, i) =>
    // from -5 eV to +5 eV
    -5 + (10 * i) / (ne - 1)
  );

  // Gaussian helper
  const gauss = (e: number, mu: number, sigma: number) =>
    Math.exp(-((e - mu) ** 2) / (2 * sigma ** 2));

  // 4) Three projections: C‐p↑, O‐d↑, O‐d↓
  const projections: PdosProjection[] = [
    {
      orbital: {
        kind_name: 'C',
        angular_momentum: 1,   // p orbital
        magnetic_number: 0,
        spin: 1,               // spin up
        position: [0, 0, 0]
      },
      energy,
      pdos: energy.map(e => gauss(e, 0.0, 0.4) * 1.0)
    },
    {
      orbital: {
        kind_name: 'O',
        angular_momentum: 2,   // d orbital
        magnetic_number: 0,
        spin: 1,               // spin up
        position: [0.5, 0.5, 0]
      },
      energy,
      pdos: energy.map(e => gauss(e, -1.2, 0.6) * 0.8)
    },
    {
      orbital: {
        kind_name: 'O',
        angular_momentum: 2,   // d orbital
        magnetic_number: 0,
        spin: -1,              // spin down
        position: [0.5, 0.5, 0]
      },
      energy,
      pdos: energy.map(e => gauss(e, 1.2, 0.6) * 0.6)
    }
  ];

  const samplePdos: PdosData = {
    fermi_energy: 0,
    projections
  };

  const [bandsData] = useState<BandData>(sampleBands);
  const [pdosData]  = useState<PdosData>(samplePdos);

  return (
    <div style={{ padding: 16 }}>
      <h2>Bands + PDOS Plot</h2>
      <BandsPdosPlot bandsData={bandsData} pdosData={pdosData} />
    </div>
  );
}
