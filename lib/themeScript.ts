import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Source of lib/theme.js, read at build time so it can be inlined in <head> (see app/layout.tsx). */
export const themeScript = readFileSync(join(process.cwd(), 'lib', 'theme.js'), 'utf8');
