import ListNode from "./ds/ListNode.js";
import TreeNode from "./ds/TreeNode.js";
import isCodeSafe from "../utils/isCodeSafe.js";
import formatValue from "./consoleScript.js";

self.onmessage = async (event) => {
    const { code } = event.data;

    Object.freeze(ListNode);
    Object.freeze(ListNode.prototype);
    Object.freeze(TreeNode);
    Object.freeze(TreeNode.prototype);

    // Define the DataStructures object
    const DataStructures = { ListNode, TreeNode };
    Object.freeze(DataStructures);

    // Make DataStructures available globally in the worker
    // self.DataStructures = DataStructures;

    // Return early if no code is provided
    if (!code || code.trim() === '') {
        self.postMessage({ error: 'No code provided' });
        return;
    }

    // Validate the code before execution
    if (!isCodeSafe(code)) {
        self.postMessage({ error: 'Invalid code: unsafe operations are not allowed.' });
        return;
    }

    // Start execution time tracking
    const start = performance.now();

    // Override console.log to capture the output in an array
    let output = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        output.push(args.map(arg => formatValue(arg)).join(' '));
    };

    // Try executing the user's code in the worker context
    try {
        eval(code);  // This will execute the code in the worker's scope
    } catch (error) {
        self.postMessage({ error: `Execution error: ${error.message}` });
        return;
    } finally {
        // Restore the original console.log after execution
        console.log = originalConsoleLog;
    }

    // End execution time tracking
    const end = performance.now();

    // Get the execution time and memory usage
    const executionTime = `${(end - start).toFixed(2)} ms`;
    const memoryUsed = `NA`;

    // Send the results back to the main thread
    self.postMessage({
        output: output.join('\n'),
        executionTime,
        memoryUsed,
    });
};