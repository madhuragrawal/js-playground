require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    const savedCode = localStorage.getItem('userCode') || `/* Welcome to the JS Playground!

 * Explore available data structures and methods using IntelliSense in the editor.
 * 
 * Data Structures:
 * - ListNode: Use DataStructures.ListNode for linked lists.
 * - TreeNode: Use DataStructures.TreeNode for binary trees.
 *
 * Happy Coding!
 */

let list = DataStructures.ListNode.createList([1, 2, 3]);
console.log(list.traverseList());
let head = list;
while (head.next) {
    head = head.next;
}
head.next = new DataStructures.ListNode(4);
head.next.next = new DataStructures.ListNode(5);
head.next.next.next = head.next;
console.log(list.traverseList());

console.log("-----")

const tree = DataStructures.TreeNode.createTree([1, 2, 3, null, null, 4, 5]);
console.log("bfsTraversal", tree.bfsTraversal());
console.log("preOrderTraversal NLR", tree.preOrderTraversal());
console.log("inOrderTraversal LNR", tree.inOrderTraversal());
console.log("postOrderTraversal LRN", tree.postOrderTraversal());
console.log(tree.printTree());`;

    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: savedCode,
        language: 'javascript',
        theme: 'vs-dark'
    });

    // Add custom IntelliSense definitions
    fetch('/types/dataStructures.d.ts')
        .then(response => response.text())
        .then(dataStructuresDefinitions => {
            monaco.languages.typescript.javascriptDefaults.addExtraLib(dataStructuresDefinitions, 'filename/dataStructures.d.ts');
        });

    // Save editor content to localStorage every 2 seconds
    setInterval(() => {
        localStorage.setItem('userCode', editor.getValue());
    }, 2000);

    window.addEventListener('resize', () => {
        editor.layout();
    });

    window.editor = editor; // Make editor globally accessible
});