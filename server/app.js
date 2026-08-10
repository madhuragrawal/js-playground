import 'dotenv/config';
import express from 'express';
import ivm from 'isolated-vm';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { performance } from 'perf_hooks';
import isCodeSafe from './utils/isCodeSafe.js';
import createIsolateContext from './sandbox/isolateRunner.js';
import { getCombinedTypeDefinitions } from '../helpers/generateTypes.js';

const port = process.env.PORT || 3005;
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

// Dynamic TypeScript typings endpoint for Monaco Editor
app.get('/api/types', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(getCombinedTypeDefinitions());
});

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: { error: 'Too many requests from this IP, please try again later.' },
});

if (process.env.NODE_ENV === 'production') {
    app.use('/execute', limiter);
}

const enableExecuteApi = process.env.ENABLE_EXECUTE_API !== 'false';

if (enableExecuteApi) {
    app.post('/execute', async (req, res) => {
        const code = req.body.code;

        if (!code || code.trim() === '') {
            return res.status(400).json({ error: 'No code provided' });
        }

        if (!isCodeSafe(code)) {
            return res.status(400).json({ error: 'Invalid code: unsafe operations are not allowed.' });
        }

        let isolate;
        let context;

        try {
            isolate = new ivm.Isolate({ memoryLimit: 64 });
            context = await createIsolateContext(isolate);

            const start = performance.now();
            const script = await isolate.compileScript(code);
            await script.run(context, { timeout: 5000 });
            const end = performance.now();

            const outputRef = await context.global.get("output");
            const outputCopy = await outputRef.copy();
            const outputStr = outputCopy.join('\n');

            const memoryUsage = isolate.getHeapStatisticsSync();
            const memoryUsed = `${(memoryUsage.used_heap_size / (1024 * 1024)).toFixed(2)} MB`;

            res.json({
                output: outputStr,
                executionTime: `${(end - start).toFixed(2)} ms`,
                memoryUsed,
            });
        } catch (error) {
            res.status(500).json({ error: error.message || 'An error occurred during execution.' });
        } finally {
            if (context) context.release();
            if (isolate) isolate.dispose();
        }
    });
} else {
    app.use('/execute', (req, res) => {
        res.status(403).json({
            error: "The API execution is disabled. Using Web Worker execution fallback.",
        });
    });
}

app.listen(port, () => {
    console.log(`JS Playground running at http://localhost:${port}`);
});

export default app;
