/**
 * Represents a singly-linked list node.
 */
declare class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null);

    /**
     * Traverse the list starting from this node.
     */
    traverseList(): void;

    /**
     * Creates a linked list from an array of values.
     * @param arr Array of numbers to create linked list.
     */
    static createList(arr: number[]): ListNode | null;
}

/**
 * Represents a binary tree node.
 */
declare class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null);

    /**
     * Builds a binary tree from an array representation.
     * @param arr Array of values to construct the binary tree.
     */
    static createTree(arr: (number | null)[]): TreeNode | null;

    /**
     * Performs a level-order (BFS) traversal.
     * @returns Array of node values in level-order.
     */
    bfsTraversal(): number[];

    /**
     * Performs a pre-order (DFS) traversal.
     * @returns Array of node values in pre-order.
     */
    preOrderTraversal(): number[];

    /**
     * Performs an in-order (DFS) traversal.
     * @returns Array of node values in in-order.
     */
    inOrderTraversal(): number[];

    /**
     * Performs a post-order (DFS) traversal.
     * @returns Array of node values in post-order.
     */
    postOrderTraversal(): number[];

    /**
     * Prints a visual representation of the tree structure to the console.
     * 
     * Generates a textual representation of the tree. Each level of the tree is indented 
     * according to its depth, making it easier to visualize the structure of 
     * the tree in the console.
     * 
     * Example output for a tree with values:
     * 
     *         1
     *       /   \
     *      2     3
     *     / \
     *    4   5
     * 
     * This visual representation helps in understanding the hierarchical 
     * relationship between nodes in the tree.
     * 
     * @returns {void} This method does not return any value. It directly prints 
     * the visual representation of the tree to the console.
     * 
     * Usage:
     * ```javascript
     * const tree = DataStructures.TreeNode.createTree([1, 2, 3]);
     * console.log(tree.printTree());
     * ```
     * 
     * Note:
     * - This function assumes that the tree has been properly constructed and
     *   that the `root` is accessible from the current instance.
     */
    printTree(): void;
}

/**
 * DataStructures namespace containing ListNode and TreeNode.
 */
declare const DataStructures: {
    ListNode: typeof ListNode;
    TreeNode: typeof TreeNode;
};