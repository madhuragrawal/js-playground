class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }

    traverseList() {
        let current = this;
        let result = [];
        const visitedNodes = new Set();
        while (current) {
            if (visitedNodes.has(current)) {
                result.push('(cycle detected at node with value ' + current.val + ')');
                break;
            }
            result.push(current.val);
            visitedNodes.add(current);
            current = current.next;
        }
        return result.join(' -> ');
    }

    static createList(arr) {
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
    }
}

export default ListNode;