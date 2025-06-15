import React, { useEffect, useRef, FC } from 'react';
import { Atoms, WEAS } from 'weas';

export interface Structure {
  // whatever minimal shape you need—WEAS.Atoms constructor will verify it
  [key: string]: any;
}

export interface StructureViewerProps {
  structure: Structure | Atoms;
  width?: number;
  height?: number;
  borderColor?: string;
}

const StructureViewer: FC<StructureViewerProps> = ({
  structure,
  width = 600,
  height = 400,
  borderColor = '#ddd',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<WEAS | null>(null);

  useEffect(() => {
    if (!containerRef.current || !structure) return;

    // convert plain object → Atoms if needed
    const atoms: Atoms = structure instanceof Atoms
      ? structure
      : new Atoms(structure);

    // clean up previous instance
    if (editorRef.current) {
      (editorRef.current as any).destroy?.();
      editorRef.current = null;
      containerRef.current!.innerHTML = '';
    }

    // create new WEAS viewer
    const editor = new WEAS({ domElement: containerRef.current });
    editor.avr.atoms = atoms;
    editor.avr.modelStyle = 1;
    editor.render();
    editorRef.current = editor;

    return () => {
      (editor as any).destroy?.();
      editorRef.current = null;
    };
  }, [structure]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        border: `1px solid ${borderColor}`,
      }}
    />
  );
};

export default StructureViewer;
