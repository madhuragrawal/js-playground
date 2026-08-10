import bstPkg from '@datastructures-js/binary-search-tree';
import listPkg from '@datastructures-js/linked-list';
import pqPkg from '@datastructures-js/priority-queue';
import queuePkg from '@datastructures-js/queue';
import stackPkg from '@datastructures-js/stack';
import triePkg from '@datastructures-js/trie';
import graphPkg from '@datastructures-js/graph';

const { BinarySearchTree, BinarySearchTreeNode, AvlTree, AvlTreeNode } = bstPkg;
const { LinkedList, LinkedListNode, DoublyLinkedList, DoublyLinkedListNode } = listPkg;
const { MinPriorityQueue, MaxPriorityQueue, PriorityQueue } = pqPkg;
const { Queue } = queuePkg;
const { Stack } = stackPkg;
const { Trie, TrieNode } = triePkg;
const { Graph, DirectedGraph } = graphPkg;

// LeetCode ListNode Helper
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
    static fromArray(arr) {
        if (!arr || !arr.length) return null;
        const head = new ListNode(arr[0]);
        let curr = head;
        for (let i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }
    toArray() {
        const res = [];
        let curr = this;
        const visited = new Set();
        while (curr && !visited.has(curr)) {
            visited.add(curr);
            res.push(curr.val);
            curr = curr.next;
        }
        return res;
    }
}

// LeetCode TreeNode Helper
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
    static fromArray(arr) {
        if (!arr || !arr.length || arr[0] === null) return null;
        const root = new TreeNode(arr[0]);
        const queue = [root];
        let i = 1;
        while (queue.length > 0 && i < arr.length) {
            const curr = queue.shift();
            if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
                curr.left = new TreeNode(arr[i]);
                queue.push(curr.left);
            }
            i++;
            if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
                curr.right = new TreeNode(arr[i]);
                queue.push(curr.right);
            }
            i++;
        }
        return root;
    }
}

const DataStructures = {
    BinarySearchTree,
    BinarySearchTreeNode,
    AvlTree,
    AvlTreeNode,
    LinkedList,
    LinkedListNode,
    DoublyLinkedList,
    DoublyLinkedListNode,
    MinPriorityQueue,
    MaxPriorityQueue,
    PriorityQueue,
    Queue,
    Stack,
    Trie,
    TrieNode,
    Graph,
    DirectedGraph,
    ListNode,
    TreeNode
};

// Global Environment Exposure
if (typeof globalThis !== 'undefined') {
    globalThis.DataStructures = DataStructures;
    globalThis.ds = DataStructures;
    globalThis.BinarySearchTree = BinarySearchTree;
    globalThis.AvlTree = AvlTree;
    globalThis.LinkedList = LinkedList;
    globalThis.DoublyLinkedList = DoublyLinkedList;
    globalThis.MinPriorityQueue = MinPriorityQueue;
    globalThis.MaxPriorityQueue = MaxPriorityQueue;
    globalThis.PriorityQueue = PriorityQueue;
    globalThis.Queue = Queue;
    globalThis.Stack = Stack;
    globalThis.Trie = Trie;
    globalThis.Graph = Graph;
    globalThis.DirectedGraph = DirectedGraph;
    globalThis.ListNode = ListNode;
    globalThis.TreeNode = TreeNode;
}

export {
    BinarySearchTree,
    BinarySearchTreeNode,
    AvlTree,
    AvlTreeNode,
    LinkedList,
    LinkedListNode,
    DoublyLinkedList,
    DoublyLinkedListNode,
    MinPriorityQueue,
    MaxPriorityQueue,
    PriorityQueue,
    Queue,
    Stack,
    Trie,
    TrieNode,
    Graph,
    DirectedGraph,
    ListNode,
    TreeNode,
    DataStructures
};
