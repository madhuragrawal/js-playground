import ivm from 'isolated-vm';
import fs from 'fs';
import path from 'path';

let dsBundleCode = '';
try {
    const bundlePath = path.resolve('public/dist/ds-bundle.min.js');
    dsBundleCode = fs.readFileSync(bundlePath, 'utf8');
} catch (e) {
    console.error('Failed to load ds-bundle.min.js in isolateRunner:', e.message);
}

function formatValue(val) {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'string') return '"' + val + '"';
    if (typeof val === 'object') {
        try {
            return JSON.stringify(val);
        } catch (e) {
            return String(val);
        }
    }
    return String(val);
}

export default async function createIsolateContext(isolate) {
    const context = await isolate.createContext();

    await context.global.set('global', context.global.derefInto());

    if (dsBundleCode) {
        await context.eval(dsBundleCode);
    }

    await context.eval(`
        const formatValue = ${formatValue};
    `);

    await context.global.set("output", new ivm.ExternalCopy([]).copyInto());

    await context.eval(`
        globalThis.console = {
            log: function () {
                const formattedArgs = Array.from(arguments).map(function (arg) { return formatValue(arg); });
                output.push(formattedArgs.join(' '));
            }
        };
    `);

    return context;
}
