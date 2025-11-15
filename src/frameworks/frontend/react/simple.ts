/**
 * React - Simple Mode Template
 * Single file with inline styles
 */

export const reactSimpleTemplate = `// React - Counter Example
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: '400px' }}>
      <h1 style={{ color: '#1a1a1a', marginBottom: '1rem' }}>Counter App</h1>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
        >
          -
        </button>
        <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3rem', textAlign: 'center' }}>
          {count}
        </span>
        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
        >
          +
        </button>
      </div>
      <button
        onClick={() => setCount(0)}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: '1px solid #dc2626', borderRadius: '4px', background: 'white', color: '#dc2626' }}
      >
        Reset
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Counter />);`;
