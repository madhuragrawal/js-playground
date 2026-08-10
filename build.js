import esbuild from 'esbuild';
import path from 'path';

async function build() {
    console.log('Bundling JS Playground assets with esbuild...');

    // 1. Data Structures Bundle
    await esbuild.build({
        entryPoints: ['src/bundle/ds-entry.js'],
        bundle: true,
        minify: true,
        format: 'iife',
        globalName: 'DSBundle',
        outfile: 'public/dist/ds-bundle.min.js',
    });

    // 2. Web Worker Bundle
    await esbuild.build({
        entryPoints: ['src/worker/workerEntry.js'],
        bundle: true,
        minify: true,
        format: 'iife',
        outfile: 'public/dist/worker-bundle.min.js',
    });

    console.log('Bundling completed successfully! Created:');
    console.log('   - public/dist/ds-bundle.min.js');
    console.log('   - public/dist/worker-bundle.min.js');
}

build().catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
});
