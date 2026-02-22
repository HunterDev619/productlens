import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|svg|avif|bmp)$/i;

export function getFlowImages(): string[] {
  const flowDir = path.join(process.cwd(), 'public', 'assets', 'flow');
  try {
    const files = fs.readdirSync(flowDir);
    return files
      .filter(f => IMAGE_EXTENSIONS.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(f => `/assets/flow/${f}`);
  } catch {
    return [];
  }
}
