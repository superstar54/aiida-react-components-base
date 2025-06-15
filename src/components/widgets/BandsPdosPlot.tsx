// src/components/widgets/BandsPdosPlot.tsx

import React, {
  FC,
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import Plot from 'react-plotly.js';
import type { Layout } from 'plotly.js';
import { Form, InputGroup } from 'react-bootstrap';

export interface BandData {
  x: number[];
  y: number[][];
  band_type_idx?: number[];
  pathlabels?: [string[], number[]];
  fermi_energy: number;
  fermi_energy_up?: number;
  fermi_energy_down?: number;
  projected_bands?: any;
}

export interface PdosProjection {
  orbital: {
    kind_name: string;
    angular_momentum: number;
    magnetic_number: number;
    spin: number;
    position: [number, number, number];
  };
  energy: number[];
  pdos: number[];
}

export interface PdosData {
  fermi_energy: number;
  fermi_energy_up?: number;
  fermi_energy_down?: number;
  projections: PdosProjection[];
}

export interface BandsPdosPlotProps {
  bandsData?: BandData;
  pdosData?: PdosData;
}

const angularMomentumLabels = ['s', 'p', 'd', 'f'];
const colorPalette = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
];

const BandsPdosPlot: FC<BandsPdosPlotProps> = ({
  bandsData,
  pdosData,
}) => {
  const [groupTag, setGroupTag] = useState<'kinds' | 'atoms'>('kinds');
  const [plotTag, setPlotTag] = useState<'total' | 'orbital' | 'angular_momentum'>('total');
  const [selectedAtoms, setSelectedAtoms] = useState<string>('');
  const [bandsWidth, setBandsWidth] = useState<number>(0.5);
  const [projectBands, setProjectBands] = useState<boolean>(false);
  const [plotData, setPlotData] = useState<any[]>([]);
  const [plotLayout, setPlotLayout] = useState<Partial<Layout>>({});

  useEffect(() => {
    processPlotData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bandsData, pdosData, groupTag, plotTag, selectedAtoms, bandsWidth, projectBands]);

  const getFermi = () => {
    const result = {
      up: 0,
      down: 0,
    };
    if (pdosData) {
      result.up = pdosData.fermi_energy_up ?? pdosData.fermi_energy;
      result.down = pdosData.fermi_energy_down ?? pdosData.fermi_energy;
    } else if (bandsData) {
      result.up = bandsData.fermi_energy_up ?? bandsData.fermi_energy;
      result.down = bandsData.fermi_energy_down ?? bandsData.fermi_energy;
    }
    return result;
  };

  // Loosen event type so it matches react-bootstrap Form.Control
  const handleSelectChange = (
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => (e: ChangeEvent<any>) => setter(e.target.value);

  const handleCheckbox = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => (e: ChangeEvent<HTMLInputElement>) => setter(e.target.checked);

  function transpose2DArray<T>(arr: T[][]): T[][] {
    return arr[0].map((_, i) => arr.map(row => row[i]));
  }

  function prepareCombinedPlotlyTraces(
    x: number[],
    ys: number[][]
  ): { xCombined: number[]; yCombined: number[] } {
    const xCombined: number[] = [];
    const yCombined: number[] = [];
    ys.forEach(yBand => {
      xCombined.push(...x, NaN);
      yCombined.push(...yBand, NaN);
    });
    return { xCombined, yCombined };
  }

  function filterPdosData(
    pd: PdosData,
    group: typeof groupTag,
    plot: typeof plotTag,
    sel: string
  ) {
    const selected = sel.trim().split(/\s+/).filter(s => s.length > 0);
    const grouped: Record<string, any> = {};
    let idx = 0;
    for (const proj of pd.projections) {
      const { orbital, energy, pdos } = proj;
      const spinLabel = orbital.spin === -1 ? ' (↓)' : ' (↑)';
      const posStr = orbital.position.map(c => c.toFixed(2)).join(',');
      if (selected.length && !selected.includes(posStr)) continue;
      let key = '';
      // grouping logic omitted for brevity
      key += spinLabel;
      if (!grouped[key]) {
        grouped[key] = {
          label: key,
          x: energy.map(e => e - pd.fermi_energy),
          y: [...pdos],
          spin: orbital.spin,
          color: colorPalette[idx++ % colorPalette.length],
        };
      } else {
        // annotate v and i
        grouped[key].y = grouped[key].y.map((v: number, i: number) => v + pdos[i]);
      }
    }
    return Object.values(grouped);
  }

  const processPlotData = () => {
    if (!bandsData && !pdosData) {
      setPlotData([]);
      setPlotLayout({});
      return;
    }

    const { up, down } = getFermi();
    const hasBands = Boolean(bandsData);
    const hasPdos = Boolean(pdosData);
    const combined = hasBands && hasPdos;
    const traces: any[] = [];
    const layout: Partial<Layout> = { showlegend: true, plot_bgcolor: 'white' };

    if (hasBands && bandsData) {
      const { x, y, band_type_idx, pathlabels } = bandsData;
      const yT = transpose2DArray(y);
      const spinIdx = band_type_idx ?? Array(yT.length).fill(0);

      Array.from(new Set(spinIdx)).forEach(spin => {
        const bands = yT.filter((_, i) => spinIdx[i] === spin);
        const { xCombined, yCombined } = prepareCombinedPlotlyTraces(x, bands);
        const fE = spin === 0 ? up : down;
        traces.push({
          x: xCombined,
          y: yCombined.map(v => v - fE),
          type: 'scattergl',
          mode: 'lines',
          name: spin === 0 ? 'Spin Up' : 'Spin Down',
          line: { color: spin === 0 ? '#111' : 'rgba(72,118,255,0.4)' },
          xaxis: combined ? 'x' : 'xaxis',
          yaxis: 'y',
        });
      });

      if (pathlabels) {
        const [labels, vals] = pathlabels;
        layout.xaxis = {
          tickvals: vals,
          ticktext: labels,
          domain: combined ? [0, 0.7] : undefined,
        };
      }

      layout.yaxis ??= {
        title: { text: 'Energy (eV)' }, // Change here
        linecolor: 'black',
        mirror: true
      };
    }

    if (hasPdos && pdosData) {
      const filtered = filterPdosData(pdosData, groupTag, plotTag, selectedAtoms);
      filtered.forEach(item => {
        traces.push({
          x: combined ? item.y.map((y: number) => -y) : item.x,
          y: combined ? item.x : item.y,
          type: 'scatter',
          mode: 'lines',
          name: item.label,
          line: { color: item.color, dash: 'solid' },
          fill: 'tozerox',
          xaxis: combined ? 'x2' : 'xaxis',
          yaxis: 'y',
        });
      });

      if (combined) {
        layout.xaxis2 = {
          domain: [0.72, 1],
          title: { text: 'Density of States' }, // Change here
          anchor: 'y'
        };
      } else {
        layout.xaxis = {
          title: { text: 'Energy (eV)' }, // Change here
          anchor: 'y'
        };
        layout.yaxis = {
          title: { text: 'Density of States' }, // Change here
          anchor: 'x'
        };
      }
    }

    // horizontal Fermi line
    traces.push({
      x: hasBands
        ? [Math.min(...traces.flatMap(t => t.x)), Math.max(...traces.flatMap(t => t.x))]
        : [-1, 1],
      y: [0, 0],
      type: 'scatter',
      mode: 'lines',
      line: { color: 'red', dash: 'dot' },
      hoverinfo: 'skip',
      showlegend: false,
    });

    setPlotData(traces);
    setPlotLayout(layout);
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="groupTag">
          <Form.Label>Group By</Form.Label>
          <Form.Control
            as="select"
            value={groupTag}
            onChange={handleSelectChange(setGroupTag)}
          >
            <option value="kinds">Kinds</option>
            <option value="atoms">Atoms</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="plotTag" className="mt-3">
          <Form.Label>Plot Contributions</Form.Label>
          <Form.Control
            as="select"
            value={plotTag}
            onChange={handleSelectChange(setPlotTag)}
          >
            <option value="total">Total</option>
            <option value="orbital">Orbital</option>
            <option value="angular_momentum">Angular Momentum</option>
          </Form.Control>
        </Form.Group>

        {bandsData?.projected_bands && (
          <Form.Group controlId="projectBands" className="mt-3">
            <Form.Check
              type="checkbox"
              label="Project Bands"
              checked={projectBands}
              onChange={handleCheckbox(setProjectBands)}
            />
            {projectBands && (
              <InputGroup className="mt-2">
                <InputGroup.Text>Bands Width</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={bandsWidth}
                  step={0.01}
                  onChange={(e) => setBandsWidth(Number(e.target.value))}
                />
              </InputGroup>
            )}
          </Form.Group>
        )}
      </Form>

      {plotData.length > 0 ? (
        <Plot
          data={plotData}
          layout={plotLayout}
          style={{ width: '100%', height: 600 }}
          useResizeHandler
          config={{ responsive: true }}
        />
      ) : (
        <div className="mt-4">No data available for plotting.</div>
      )}
    </div>
  );
};

export default BandsPdosPlot;
