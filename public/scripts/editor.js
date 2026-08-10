require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], function () {
    const defaultCode = `/* Welcome to the JS Playground!
 * Powered by @datastructures-js with full Monaco Editor IntelliSense.
 * 
 * Available Data Structures out of the box:
 * - BinarySearchTree, AvlTree
 * - MinPriorityQueue, MaxPriorityQueue
 * - LinkedList, DoublyLinkedList
 * - Queue, Stack, Trie, Graph
 * - ListNode, TreeNode (LeetCode helpers)
 */

// 1. Binary Search Tree Example (@datastructures-js)
const bst = new BinarySearchTree();
bst.insert(15);
bst.insert(10);
bst.insert(20);
bst.insert(8);
bst.insert(12);

console.log("BST Root:", bst.root().getValue());
console.log("Has 12?:", bst.has(12));

// 2. Priority Queue Example
const pq = new MinPriorityQueue();
pq.enqueue("Low Priority Task", 3);
pq.enqueue("High Priority Task", 1);
pq.enqueue("Medium Priority Task", 2);

console.log("Front (Highest Priority):", pq.front());

// 3. LeetCode Helper Example
const list = ListNode.fromArray([1, 2, 3, 4, 5]);
console.log("Linked List array:", list.toArray());
`;

    // Configure Monaco Compiler Options for JavaScript / TypeScript autocompletion
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        allowJs: true,
        noLib: false
    });

    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    const savedCode = localStorage.getItem('userCode') || defaultCode;

    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: savedCode,
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        fontFamily: "'Fira Code', 'Consolas', monospace",
        fontSize: 14,
        minimap: { enabled: false },
        padding: { top: 12 }
    });

    // Fetch and register dynamic TypeScript typings for @datastructures-js
    fetch('/api/types')
        .then(response => response.text())
        .then(typeDefinitions => {
            monaco.languages.typescript.javascriptDefaults.addExtraLib(
                typeDefinitions,
                'ts:filename/datastructures.d.ts'
            );
        })
        .catch(err => console.error("Could not load typings:", err));

    // Save editor content to localStorage
    setInterval(() => {
        localStorage.setItem('userCode', editor.getValue());
    }, 2000);

    window.addEventListener('resize', () => {
        editor.layout();
    });

    window.editor = editor;
});