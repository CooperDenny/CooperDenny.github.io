/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The static project write-ups under public/projects/<slug>/index.html aren't
  // app routes, so a directory-style URL doesn't auto-resolve to its index.html
  // the way plain static hosting (or `next export`) would. Next's own trailing-slash
  // redirect strips the "/" from `/projects/<slug>/` before any request ever reaches
  // this rewrite, so both the slash and no-slash forms are rewritten here — this runs
  // in `next dev`/`next start` and on Netlify alike (the netlify.toml redirect alone
  // does not, since it never fires locally).
  async rewrites() {
    return [
      { source: '/projects/:slug/', destination: '/projects/:slug/index.html' },
      { source: '/projects/:slug', destination: '/projects/:slug/index.html' },
    ];
  },
};

module.exports = nextConfig;
