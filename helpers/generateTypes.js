export function getCombinedTypeDefinitions() {
    return `
/**
 * JS Playground Global Data Structures Typings
 * Native @datastructures-js IntelliSense
 */

declare class DoublyLinkedListNode<T = any> {
    constructor(value?: T);
    getValue(): T;
    setValue(value: T): void;
    getNext(): DoublyLinkedListNode<T> | null;
    getPrev(): DoublyLinkedListNode<T> | null;
}

declare class DoublyLinkedList<T = any> {
    constructor();
    insertFirst(value: T): DoublyLinkedListNode<T>;
    insertLast(value: T): DoublyLinkedListNode<T>;
    insertAt(position: number, value: T): DoublyLinkedListNode<T>;
    insertBefore(value: T, node?: DoublyLinkedListNode<T>): DoublyLinkedListNode<T>;
    insertAfter(value: T, node?: DoublyLinkedListNode<T>): DoublyLinkedListNode<T>;
    removeFirst(): DoublyLinkedListNode<T> | null;
    removeLast(): DoublyLinkedListNode<T> | null;
    removeAt(position: number): DoublyLinkedListNode<T> | null;
    remove(node: DoublyLinkedListNode<T>): DoublyLinkedListNode<T> | null;
    head(): DoublyLinkedListNode<T> | null;
    tail(): DoublyLinkedListNode<T> | null;
    count(): number;
    toArray(): DoublyLinkedListNode<T>[];
    isEmpty(): boolean;
    clear(): void;
    static fromArray<T>(values: T[]): DoublyLinkedList<T>;
}

declare class LinkedListNode<T = any> {
    constructor(value?: T);
    getValue(): T;
    setValue(value: T): void;
    getNext(): LinkedListNode<T> | null;
}

declare class LinkedList<T = any> {
    constructor();
    insertFirst(value: T): LinkedListNode<T>;
    insertLast(value: T): LinkedListNode<T>;
    insertAt(position: number, value: T): LinkedListNode<T>;
    removeFirst(): LinkedListNode<T> | null;
    removeLast(): LinkedListNode<T> | null;
    removeAt(position: number): LinkedListNode<T> | null;
    head(): LinkedListNode<T> | null;
    tail(): LinkedListNode<T> | null;
    count(): number;
    toArray(): LinkedListNode<T>[];
    isEmpty(): boolean;
    clear(): void;
    static fromArray<T>(values: T[]): LinkedList<T>;
}

declare class BinarySearchTreeNode<T = any> {
    constructor(value?: T);
    getValue(): T;
    setValue(value: T): void;
    getLeft(): BinarySearchTreeNode<T> | null;
    getRight(): BinarySearchTreeNode<T> | null;
}

declare class BinarySearchTree<T = any> {
    constructor(compare?: (a: T, b: T) => number);
    insert(value: T): BinarySearchTree<T>;
    has(value: T): boolean;
    find(value: T): BinarySearchTreeNode<T> | null;
    max(): BinarySearchTreeNode<T> | null;
    min(): BinarySearchTreeNode<T> | null;
    root(): BinarySearchTreeNode<T> | null;
    count(): number;
    remove(value: T): boolean;
    traverseInOrder(cb: (node: BinarySearchTreeNode<T>) => void): void;
    traversePreOrder(cb: (node: BinarySearchTreeNode<T>) => void): void;
    traversePostOrder(cb: (node: BinarySearchTreeNode<T>) => void): void;
    clear(): void;
}

declare class AvlTreeNode<T = any> extends BinarySearchTreeNode<T> {}

declare class AvlTree<T = any> extends BinarySearchTree<T> {}

declare class MinPriorityQueue<T = any> {
    constructor(options?: { priority?: (element: T) => number });
    enqueue(element: T, priority?: number): MinPriorityQueue<T>;
    dequeue(): T;
    front(): T;
    back(): T;
    size(): number;
    isEmpty(): boolean;
    clear(): void;
    toArray(): T[];
}

declare class MaxPriorityQueue<T = any> extends MinPriorityQueue<T> {}

declare class PriorityQueue<T = any> extends MinPriorityQueue<T> {}

declare class Queue<T = any> {
    constructor();
    enqueue(element: T): Queue<T>;
    dequeue(): T;
    front(): T;
    back(): T;
    size(): number;
    isEmpty(): boolean;
    clear(): void;
    toArray(): T[];
}

declare class Stack<T = any> {
    constructor();
    push(element: T): Stack<T>;
    pop(): T;
    peek(): T;
    size(): number;
    isEmpty(): boolean;
    clear(): void;
    toArray(): T[];
}

declare class TrieNode {
    isEndOfWord(): boolean;
}

declare class Trie {
    constructor();
    insert(word: string): Trie;
    has(word: string): boolean;
    remove(word: string): boolean;
    clear(): void;
}

declare class Graph {
    constructor();
    addVertex(key: string | number): Graph;
    removeVertex(key: string | number): boolean;
    addEdge(source: string | number, destination: string | number, weight?: number): Graph;
    removeEdge(source: string | number, destination: string | number): boolean;
    hasVertex(key: string | number): boolean;
    hasEdge(source: string | number, destination: string | number): boolean;
    getVerticesCount(): number;
}

declare class DirectedGraph extends Graph {}

declare class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null);
    static fromArray(arr: number[]): ListNode | null;
    toArray(): number[];
}

declare class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null);
    static fromArray(arr: (number | null)[]): TreeNode | null;
}

declare const DataStructures: {
    BinarySearchTree: typeof BinarySearchTree;
    AvlTree: typeof AvlTree;
    LinkedList: typeof LinkedList;
    DoublyLinkedList: typeof DoublyLinkedList;
    MinPriorityQueue: typeof MinPriorityQueue;
    MaxPriorityQueue: typeof MaxPriorityQueue;
    PriorityQueue: typeof PriorityQueue;
    Queue: typeof Queue;
    Stack: typeof Stack;
    Trie: typeof Trie;
    Graph: typeof Graph;
    DirectedGraph: typeof DirectedGraph;
    ListNode: typeof ListNode;
    TreeNode: typeof TreeNode;
};

declare const ds: typeof DataStructures;
`;
}
