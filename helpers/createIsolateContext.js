import ivm from 'isolated-vm';
import ListNode from '../public/scripts/ds/ListNode.js';
import TreeNode from '../public/scripts/ds/TreeNode.js';
import formatValue from '../public/scripts/consoleScript.js';

export default async function createIsolateContext(isolate) {

    const context = await isolate.createContext();

    // This makes the global object available in the context as `global`. We use `derefInto()` here
    // because otherwise `global` would actually be a Reference{} object in the new isolate.
    await context.global.set('global', context.global.derefInto());

    await context.eval(`
        const ListNode = ${ListNode};
        const TreeNode = ${TreeNode};
        const formatValue = ${formatValue};    
    `);

    await context.eval(`
        Object.freeze(ListNode);
        Object.freeze(ListNode.prototype);
        Object.freeze(TreeNode);
        Object.freeze(TreeNode.prototype);
        const DataStructures = { ListNode, TreeNode };
        Object.freeze(DataStructures);
    `)

    // await context.eval(`globalThis.DataStructures = DataStructures;`);

    // Create an empty array for output and make it available in the isolate's global context
    await context.global.set("output", new ivm.ExternalCopy([]).copyInto());

    // Override console.log to push messages into the `output` array within the isolate
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