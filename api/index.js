import 'dotenv/config';
import express from 'express';
import ivm from 'isolated-vm';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { performance } from 'perf_hooks';
import isCodeSafe from '../public/utils/isCodeSafe.js';
import createIsolateContext from './createIsolateContext.js';

const port = process.env.PORT || 3005;

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' },
});

// Apply rate limiting only in production
if (process.env.NODE_ENV === 'production') {
    app.use('/execute', limiter); // Apply to the /execute route only
}

app.post('/execute', async (req, res) => {
    const code = req.body.code;

    // Return early if no code is provided
    if (!code || code.trim() === '') {
        return res.status(400).json({ error: 'No code provided' });
    }

    // Validate the code before execution
    if (!isCodeSafe(code)) {
        return res.status(400).json({ error: 'Invalid code: unsafe operations are not allowed.' });
    }

    let isolate;
    let context;

    try {
        // Create a new isolate limited to 64MB
        isolate = new ivm.Isolate({ memoryLimit: 64 });

        context = await createIsolateContext(isolate);

        // Start timing execution
        const start = performance.now();

        // Compile and run the user-provided code
        const script = await isolate.compileScript(code);
        await script.run(context, { timeout: 5000 }); // 5 seconds timeout

        // End timing execution
        const end = performance.now();

        // Retrieve the output from the isolate's global object
        const output = await context.global.get("output");
        const outputCopy = await output.copy();  // Copy data back to the main context
        const outputStr = outputCopy.join('\n');

        // Retrieve memory usage from the isolate
        const memoryUsage = isolate.getHeapStatisticsSync();
        const memoryUsed = `${(memoryUsage.used_heap_size / (1024 * 1024)).toFixed(2)} MB`; // Convert bytes to MB

        res.json({
            output: outputStr,
            executionTime: `${(end - start).toFixed(2)} ms`,
            memoryUsed,
        });
    } catch (error) {
        // console.error('Execution error:', error); // Log error on the server
        res.status(500).json({ _error: 'An error occurred during execution.', error: error.message });
    } finally {
        if (context) context.release();
        if (isolate) isolate.dispose();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;