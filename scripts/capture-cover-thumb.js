const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Renders the magazine thumbnails directly from the current PDFs' first pages
 * using macOS QuickLook generator (qlmanage), ensuring pixel-perfect fidelity
 * without recreating the layout in HTML.
 */
function renderPdfThumbnails() {
  const arPdf = path.join(__dirname, '..', 'public', 'magazine', 'issue-zero.pdf');
  const enPdf = path.join(__dirname, '..', 'public', 'magazine', 'issue-zero-en.pdf');
  const tmpDir = '/tmp';

  console.log('Rendering cover thumbnails directly from actual PDF binaries...');
  execSync(`qlmanage -t -s 1200 -o ${tmpDir} "${arPdf}"`, { stdio: 'inherit' });
  execSync(`qlmanage -t -s 1200 -o ${tmpDir} "${enPdf}"`, { stdio: 'inherit' });

  const targetAr = path.join(__dirname, '..', 'public', 'magazine', 'issue-zero-cover-thumb.png');
  const targetEn = path.join(__dirname, '..', 'public', 'magazine', 'issue-zero-cover-thumb-en.png');

  fs.copyFileSync(path.join(tmpDir, 'issue-zero.pdf.png'), targetAr);
  fs.copyFileSync(path.join(tmpDir, 'issue-zero-en.pdf.png'), targetEn);

  console.log(`Successfully generated direct PDF thumbnails:\n  - ${targetAr}\n  - ${targetEn}`);
}

renderPdfThumbnails();
