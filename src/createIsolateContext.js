import ivm from 'isolated-vm';
import ListNode from './ds/ListNode.js';
import TreeNode from './ds/TreeNode.js';
import consoleScript from './consoleScript.js';

export default async function createIsolateContext(isolate) {

    const context = await isolate.createContext();

    // Prevent the code inside the isolate from escaping by setting an undefined global variable
    await context.global.set('global', context.global.derefInto());

    await context.eval(`const DataStructures = {};`);
    await context.eval(ListNode);
    await context.eval(TreeNode);
    await context.eval(`Object.freeze(DataStructures);`);

    await context.eval(`globalThis.DataStructures = DataStructures;`);

    // Create an empty array for output and make it available in the isolate's global context
    await context.global.set("output", new ivm.ExternalCopy([]).copyInto());

    // Override console.log to push messages into the `output` array within the isolate
    await context.eval(consoleScript);

    return context;
}