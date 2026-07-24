/**
 * Application root — CIBLE School of Language.
 *
 * Transitional shell rendered at the `#root` mount node by `src/main.jsx`. The
 * persistent navigation, client-side routing and page tree are composed on top
 * of this root as the site is built out. It intentionally has no dependencies
 * on the removed Vite starter assets (react.svg, vite.svg, hero.png, App.css,
 * icons.svg) so the production build resolves cleanly.
 */
function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#0f172a',
        background: '#ffffff',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
        CIBLE School of Language
      </h1>
      <p style={{ color: '#475569', margin: 0 }}>
        Learn English. Build Confidence. Shape Your Future.
      </p>
    </main>
  )
}

export default App
