import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|svg|avif|bmp)$/i;

export function getAnalyseImages(): string[] {
  const analyseDir = path.join(process.cwd(), 'public', 'assets', 'analyse');
  try {
    const files = fs.readdirSync(analyseDir);
    return files
      .filter(f => IMAGE_EXTENSIONS.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(f => `/assets/analyse/${f}`);
  } catch {
    return [];
  }
}
