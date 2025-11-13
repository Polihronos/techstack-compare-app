'use client';

import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
  onData?: (data: string) => void;
  className?: string;
}

export function Terminal({ onData, className }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!terminalRef.current) return;

      // Initialize xterm
      const xterm = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
      rows: 20,
      scrollback: 1000,
    });

    // Add fit addon
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    // Open terminal in DOM
    xterm.open(terminalRef.current);
    fitAddon.fit();

    // Store references
    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Handle user input
    if (onData) {
      xterm.onData((data) => {
        onData(data);
      });
    }

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // Initial welcome message
    xterm.writeln('Terminal initialized. Waiting for output...');
    xterm.writeln('');

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        xterm.dispose();
      };
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, [onData]);

  // Expose write method via ref and mark as ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (xtermRef.current) {
        console.log('[Terminal] Terminal ready and exposed to window');
        // Store write method on window for easy access (temporary for development)
        (window as any).__terminal = {
          write: (data: string) => xtermRef.current?.write(data),
          writeln: (data: string) => xtermRef.current?.writeln(data),
          clear: () => xtermRef.current?.clear(),
          ready: true, // Mark as ready
        };

        // Trigger custom event to notify that terminal is ready
        window.dispatchEvent(new CustomEvent('terminal-ready'));
      }
    }, 150); // Small delay to ensure terminal is fully initialized

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={terminalRef}
      className={className}
      style={{ height: '100%', width: '100%' }}
    />
  );
}

// Helper hook to get terminal instance
export function useTerminalWriter() {
  const write = (data: string) => {
    const terminal = (window as any).__terminal;
    if (terminal) {
      terminal.write(data);
    }
  };

  const writeln = (data: string) => {
    const terminal = (window as any).__terminal;
    if (terminal) {
      terminal.writeln(data);
    }
  };

  const clear = () => {
    const terminal = (window as any).__terminal;
    if (terminal) {
      terminal.clear();
    }
  };

  return { write, writeln, clear };
}
