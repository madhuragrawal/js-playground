export default `

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }

    static createTree(arr) {
        if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;

        const root = new TreeNode(arr[0]);
        const queue = [root];
        let index = 1;

        while (index < arr.length) {
            const currentNode = queue.shift();

            if (index < arr.length) {
                if (arr[index] !== null) {
                    currentNode.left = new TreeNode(arr[index]);
                    queue.push(currentNode.left);
                }
                index++;
            }

            if (index < arr.length) {
                if (arr[index] !== null) {
                    currentNode.right = new TreeNode(arr[index]);
                    queue.push(currentNode.right);
                }
                index++;
            }
        }

        return root;
    }

    printTree() {
        const result = [];
        const queue = [this];

        while (queue.length > 0) {
            const node = queue.shift();

            if (node) {
                result.push(node.val);
                queue.push(node.left);
                queue.push(node.right);
            } else {
                result.push(null);
            }
        }

        while (result[result.length - 1] === null) {
            result.pop();
        }

        return { result, ____printType: "canvas" };
    }

    // BFS Traversal (Level-order)
    bfsTraversal() {
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
    }

    // DFS Pre-order Traversal
    preOrderTraversal() {
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
    }

    // DFS In-order Traversal
    inOrderTraversal() {
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
    }

    // DFS Post-order Traversal
    postOrderTraversal() {
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
    }
}

DataStructures.TreeNode = TreeNode;

`;