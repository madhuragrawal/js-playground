require('dotenv').config();
const express = require('express');
const isolatedVm = require('isolated-vm');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { performance } = require('perf_hooks');
const { dataStructuresDefinition } = require('../utils/dataStructuresDefinition');
const { consoleScript } = require('../utils/consoleScript');

const port = process.env.PORT || 3005;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); // Serve static files from the 'public' directory

// Serve index.html as the default response for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
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

// Function to validate the user code
function isCodeSafe(code) {
    const unsafePatterns = [
        /require\s*\(/, // disallow require statements
        /process\s*\./, // disallow access to process
        /child_process/, // disallow child process
        /exec\s*\(/, // disallow exec calls
    ];
    return !unsafePatterns.some(pattern => pattern.test(code));
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

    try {
        isolate = new isolatedVm.Isolate({ memoryLimit: 64 });
        const context = await isolate.createContext();

        // Prevent the code inside the isolate from escaping by setting an undefined global variable
        await context.global.set('global', context.global.derefInto());

        // Define a generic DataStructures object in the isolate context
        await context.eval(dataStructuresDefinition);

        // Create an empty array for output and make it available in the isolate's global context
        await context.global.set("output", new isolatedVm.ExternalCopy([]).copyInto());

        // Override console.log to push messages into the `output` array within the isolate
        await context.eval(consoleScript);

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
        if (isolate) {
            isolate.dispose(); // Clean up the isolate
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;