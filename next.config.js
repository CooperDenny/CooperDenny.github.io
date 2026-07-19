/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages: there's no Supabase, no server actions, no
  // API routes, and every route already prerenders as static ("○ (Static)" in
  // the build output) — so `next build` writes plain HTML/CSS/JS to `out/` and
  // GitHub Pages just serves it, same as the original static site did.
  //
  // This is also why there's no `rewrites()`/`redirects()` config for the
  // /projects/<slug>/ static write-ups: `output: 'export'` doesn't support
  // custom routing (Next errors at build time if you try), but it doesn't need
  // to here — export mode writes each one to public/projects/<slug>/index.html
  // and GitHub Pages resolves a directory-style URL to that file on its own,
  // exactly like plain static hosting always has.
  output: 'export',
};

module.exports = nextConfig;
