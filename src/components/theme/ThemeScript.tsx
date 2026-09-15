const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('toprep-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`

// Runs before paint to set the theme attribute and avoid a flash of the
// wrong theme. Must stay a plain server-rendered <script>, not a
// useEffect — by the time React hydrates, the first frame is already drawn.
export function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
}
