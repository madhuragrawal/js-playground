export const dataStructuresDefinition = `

const DataStructures = {};

// ListNode definition
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

// Add traverseList method to ListNode prototype
ListNode.prototype.traverseList = function () {
    let current = this;
    let result = [];
    const visitedNodes = new Set();
    while (current) {
        if (visitedNodes.has(current)) {
            result.push(\`(cycle detected at node with value \${ current.val })\`);
            break;
        }
        result.push(current.val);
        visitedNodes.add(current);
        current = current.next;
    }
    return result.join(' -> ');
};

// Add createList as a static method for ListNode
ListNode.createList = function (arr) {
    if (!Array.isArray(arr)) return null;
    let head = null;
    let current = null;
    for (let val of arr) {
        const newNode = new ListNode(val);
        if (!head) {
            head = newNode;
            current = head;
        } else {
            current.next = newNode;
            current = newNode;
        }
    }
    return head;
};

// Attach ListNode to DataStructures
DataStructures.ListNode = ListNode;

// TreeNode definition
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

// Function to build a binary tree from an array
TreeNode.createTree = function (arr) {
    if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;

    const root = new TreeNode(arr[0]);
    const queue = [root];
    let index = 1;

    while (index < arr.length) {
        const currentNode = queue.shift();

        // Assign left child
        if (index < arr.length) {
            if (arr[index] !== null) {
                currentNode.left = new TreeNode(arr[index]);
                queue.push(currentNode.left);
            }
            index++;
        }

        // Assign right child
        if (index < arr.length) {
            if (arr[index] !== null) {
                currentNode.right = new TreeNode(arr[index]);
                queue.push(currentNode.right);
            }
            index++;
        }
    }

    return root;
};

// BFS Traversal (level-order) for TreeNode
TreeNode.prototype.printTree = function () {
    const result = [];
    const queue = [this];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        // Push the value or null if the node is null
        if (node) {
            result.push(node.val);
            queue.push(node.left);  // Push left child (can be null)
            queue.push(node.right); // Push right child (can be null)
        } else {
            result.push(null); // Preserve null for missing children
        }
    }
    
    // Optionally, clean up trailing nulls for a neater output
    while (result[result.length - 1] === null) {
        result.pop();
    }

    // Return the result for further processing or logging
    return { result, ____printType: "canvas" };
};

// BFS Traversal (level-order) for TreeNode
TreeNode.prototype.bfsTraversal = function () {
    const result = [];
    const queue = [this];

    while (queue.length > 0) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }

    return result;
};

// DFS Pre-order Traversal
TreeNode.prototype.preOrderTraversal = function () {
    const result = [];
    function traverse(node) {
        if (node) {
            result.push(node.val);
            traverse(node.left);
            traverse(node.right);
        }
    }
    traverse(this);
    return result;
};

// DFS In-order Traversal
TreeNode.prototype.inOrderTraversal = function () {
    const result = [];
    function traverse(node) {
        if (node) {
            traverse(node.left);
            result.push(node.val);
            traverse(node.right);
        }
    }
    traverse(this);
    return result;
};

// DFS Post-order Traversal
TreeNode.prototype.postOrderTraversal = function () {
    const result = [];
    function traverse(node) {
        if (node) {
            traverse(node.left);
            traverse(node.right);
            result.push(node.val);
        }
    }
    traverse(this);
    return result;
};

// Attach TreeNode to DataStructures
DataStructures.TreeNode = TreeNode;

Object.freeze(DataStructures);
Object.freeze(DataStructures.ListNode);
Object.freeze(DataStructures.TreeNode);

globalThis.DataStructures = DataStructures; // Expose DataStructures to global context

`;