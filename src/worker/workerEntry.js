import {
    BinarySearchTree,
    AvlTree,
    LinkedList,
    DoublyLinkedList,
    MinPriorityQueue,
    MaxPriorityQueue,
    PriorityQueue,
    Queue,
    Stack,
    Trie,
    Graph,
    DirectedGraph,
    ListNode,
    TreeNode,
    DataStructures
} from '../bundle/ds-entry.js';

import isCodeSafe from '../../server/utils/isCodeSafe.js';

function formatValue(val) {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'string') return '"' + val + '"';
    if (typeof val === 'object') {
        try {
            return JSON.stringify(val, null, 2);
        } catch (e) {
            return String(val);
        }
    }
    return String(val);
}

self.onmessage = async (event) => {
    const { code } = event.data;

    if (!code || code.trim() === '') {
        self.postMessage({ error: 'No code provided' });
        return;
    }

    if (typeof isCodeSafe === 'function' && !isCodeSafe(code)) {
        self.postMessage({ error: 'Invalid code: unsafe operations are not allowed.' });
        return;
    }

    const start = performance.now();
    let output = [];
    const originalConsoleLog = console.log;

    console.log = (...args) => {
        output.push(args.map(arg => formatValue(arg)).join(' '));
    };

    try {
        const runUserCode = new Function(
            'BinarySearchTree', 'AvlTree', 'LinkedList', 'DoublyLinkedList',
            'MinPriorityQueue', 'MaxPriorityQueue', 'PriorityQueue', 'Queue',
            'Stack', 'Trie', 'Graph', 'DirectedGraph', 'ListNode', 'TreeNode',
            'DataStructures', 'ds',
            code
        );

        runUserCode(
            BinarySearchTree, AvlTree, LinkedList, DoublyLinkedList,
            MinPriorityQueue, MaxPriorityQueue, PriorityQueue, Queue,
            Stack, Trie, Graph, DirectedGraph, ListNode, TreeNode,
            DataStructures, DataStructures
        );
    } catch (error) {
        self.postMessage({ error: `Execution error: ${error.message}` });
        return;
    } finally {
        console.log = originalConsoleLog;
    }

    const end = performance.now();

    let memoryUsed = 'N/A';
    if (performance.memory) {
        memoryUsed = `${(performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`;
    }

    self.postMessage({
        output: output.join('\n'),
        executionTime: `${(end - start).toFixed(2)} ms`,
        memoryUsed,
    });
};
