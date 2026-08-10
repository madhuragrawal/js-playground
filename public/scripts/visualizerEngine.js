export class UniversalVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize(width, height) {
        const dpr = window.devicePixelRatio || 2;
        this.canvas.width = Math.max(width, 600) * dpr;
        this.canvas.height = Math.max(height, 350) * dpr;
        this.canvas.style.width = `${Math.max(width, 600)}px`;
        this.canvas.style.height = `${Math.max(height, 350)}px`;
        this.ctx.scale(dpr, dpr);
        this.ctx.imageSmoothingEnabled = true;
    }

    // --- 1. Tree Renderer (BST, AVL, TreeNode) ---
    renderTree(root) {
        if (!root) {
            this.clear();
            return;
        }

        const treeObj = this._normalizeTreeNode(root);
        if (!treeObj) return;

        const depth = this._getTreeDepth(treeObj);
        const height = Math.max(350, depth * 70 + 60);
        const width = Math.max(600, Math.pow(2, depth) * 45);
        this.resize(width, height);
        this.clear();

        this._drawTreeNode(treeObj, width / 2, 40, width / 4, 1);
    }

    _normalizeTreeNode(node) {
        if (!node) return null;

        let value = node.val;
        let left = node.left;
        let right = node.right;

        if (typeof node.getValue === 'function') value = node.getValue();
        if (typeof node.getLeft === 'function') left = node.getLeft();
        if (typeof node.getRight === 'function') right = node.getRight();

        if (value === undefined || value === null) return null;

        return {
            value,
            left: left ? this._normalizeTreeNode(left) : null,
            right: right ? this._normalizeTreeNode(right) : null
        };
    }

    _getTreeDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(this._getTreeDepth(node.left), this._getTreeDepth(node.right));
    }

    _drawTreeNode(node, x, y, xOffset, level) {
        if (!node) return;

        const radius = 20;

        if (node.left) {
            const childX = x - xOffset;
            const childY = y + 60;
            this._drawLine(x, y + radius, childX, childY - radius);
            this._drawTreeNode(node.left, childX, childY, xOffset / 2, level + 1);
        }

        if (node.right) {
            const childX = x + xOffset;
            const childY = y + 60;
            this._drawLine(x, y + radius, childX, childY - radius);
            this._drawTreeNode(node.right, childX, childY, xOffset / 2, level + 1);
        }

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.stroke();

        this.ctx.font = '500 13px "Fira Code", monospace';
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(String(node.value), x, y);
    }

    _drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#475569';
        this.ctx.stroke();
    }

    // --- 2. Linked List Renderer ---
    renderLinkedList(head) {
        if (!head) {
            this.clear();
            return;
        }

        const nodes = [];
        let curr = head;
        const visited = new Set();

        while (curr && !visited.has(curr)) {
            visited.add(curr);
            let val = curr.val;
            let next = curr.next;
            if (typeof curr.getValue === 'function') val = curr.getValue();
            if (typeof curr.getNext === 'function') next = curr.getNext();

            if (val !== undefined && val !== null) {
                nodes.push(String(val));
            }
            curr = next;
        }

        const nodeWidth = 65;
        const nodeHeight = 36;
        const spacing = 35;
        const totalWidth = Math.max(500, nodes.length * (nodeWidth + spacing) + 80);
        this.resize(totalWidth, 120);
        this.clear();

        let x = 40;
        const y = 60;

        for (let i = 0; i < nodes.length; i++) {
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(x, y - nodeHeight / 2, nodeWidth, nodeHeight);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#06b6d4';
            this.ctx.strokeRect(x, y - nodeHeight / 2, nodeWidth, nodeHeight);

            this.ctx.font = '500 13px "Fira Code", monospace';
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(nodes[i], x + nodeWidth / 2, y);

            if (i < nodes.length - 1) {
                this._drawArrow(x + nodeWidth, y, x + nodeWidth + spacing, y);
            }
            x += nodeWidth + spacing;
        }
    }

    // --- 3. Priority Queue Renderer ---
    renderPriorityQueue(pq) {
        if (!pq || typeof pq.toArray !== 'function') {
            this.clear();
            return;
        }

        let items = [];
        try {
            items = pq.toArray();
        } catch (e) {
            return;
        }

        const cardWidth = 140;
        const cardHeight = 50;
        const spacing = 20;
        const totalWidth = Math.max(500, items.length * (cardWidth + spacing) + 60);
        this.resize(totalWidth, 140);
        this.clear();

        let x = 30;
        const y = 45;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const elemText = typeof item === 'object' && item.element ? String(item.element) : String(item);
            const priorityText = typeof item === 'object' && item.priority !== undefined ? `P: ${item.priority}` : `#${i + 1}`;

            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(x, y, cardWidth, cardHeight);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = i === 0 ? '#10b981' : '#6366f1';
            this.ctx.strokeRect(x, y, cardWidth, cardHeight);

            this.ctx.fillStyle = i === 0 ? '#10b981' : '#818cf8';
            this.ctx.font = '600 11px var(--font-sans)';
            this.ctx.fillText(priorityText, x + cardWidth - 25, y + 15);

            this.ctx.fillStyle = '#f8fafc';
            this.ctx.font = '500 12px "Fira Code", monospace';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(elemText.length > 12 ? elemText.slice(0, 10) + '..' : elemText, x + 10, y + 30);

            x += cardWidth + spacing;
        }
    }

    // --- 4. Queue / Stack Renderer ---
    renderQueueOrStack(collection, type = 'queue') {
        if (!collection || typeof collection.toArray !== 'function') {
            this.clear();
            return;
        }

        const items = collection.toArray();
        const boxWidth = 80;
        const boxHeight = 40;
        const spacing = 15;
        const totalWidth = Math.max(500, items.length * (boxWidth + spacing) + 80);
        this.resize(totalWidth, 130);
        this.clear();

        let x = 40;
        const y = 55;

        for (let i = 0; i < items.length; i++) {
            const itemText = String(items[i]);

            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(x, y, boxWidth, boxHeight);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.strokeRect(x, y, boxWidth, boxHeight);

            this.ctx.font = '500 12px "Fira Code", monospace';
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(itemText.length > 8 ? itemText.slice(0, 7) + '..' : itemText, x + boxWidth / 2, y + boxHeight / 2);

            if (i === 0) {
                this.ctx.font = '600 10px var(--font-sans)';
                this.ctx.fillStyle = '#38bdf8';
                this.ctx.fillText(type === 'stack' ? '[TOP]' : '[FRONT]', x + boxWidth / 2, y - 12);
            }

            x += boxWidth + spacing;
        }
    }

    // --- 5. Dynamic Non-Overlapping Trie Renderer ---
    renderTrie(trie) {
        if (!trie) {
            this.clear();
            return;
        }

        let root = trie._root || trie;
        if (!root) {
            this.clear();
            return;
        }

        const treeObj = this._normalizeTrieNode(root);
        if (!treeObj) return;

        const leafCount = treeObj.leafWidth;
        const depth = treeObj.depth;

        const nodeRadius = 18;
        const minSpacing = nodeRadius * 2.8;
        const width = Math.max(700, leafCount * minSpacing * 1.5 + 100);
        const height = Math.max(380, depth * 65 + 80);

        this.resize(width, height);
        this.clear();

        this._drawTrieNodeSubtree(treeObj, 40, width - 40, 40);
    }

    _normalizeTrieNode(node) {
        if (!node) return null;

        const char = node._char !== undefined ? (node._char || 'ROOT') : 'ROOT';
        const isEnd = Boolean(node._isEndOfWord);

        const children = [];
        if (node._children && typeof node._children.entries === 'function') {
            for (const [ch, childNode] of node._children.entries()) {
                const childObj = this._normalizeTrieNode(childNode);
                if (childObj) children.push(childObj);
            }
        }

        let leafWidth = 0;
        let depth = 1;

        if (children.length === 0) {
            leafWidth = 1;
        } else {
            for (const child of children) {
                leafWidth += child.leafWidth;
                depth = Math.max(depth, 1 + child.depth);
            }
        }

        return { char, isEnd, children, leafWidth, depth };
    }

    _drawTrieNodeSubtree(node, leftBound, rightBound, y) {
        if (!node) return;

        const nodeX = (leftBound + rightBound) / 2;
        const radius = 18;

        if (node.children.length > 0) {
            const totalLeaves = node.leafWidth;
            let currentLeft = leftBound;

            for (const child of node.children) {
                const childSpan = ((rightBound - leftBound) * child.leafWidth) / totalLeaves;
                const childRight = currentLeft + childSpan;
                const childX = (currentLeft + childRight) / 2;
                const childY = y + 60;

                this._drawLine(nodeX, y + radius, childX, childY - radius);
                this._drawTrieNodeSubtree(child, currentLeft, childRight, childY);

                currentLeft = childRight;
            }
        }

        // Draw Node Circle
        this.ctx.beginPath();
        this.ctx.arc(nodeX, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = node.isEnd ? 'rgba(16, 185, 129, 0.25)' : '#1e293b';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = node.isEnd ? '#10b981' : '#38bdf8';
        this.ctx.stroke();

        // Draw Character Text
        this.ctx.font = '600 12px "Fira Code", monospace';
        this.ctx.fillStyle = node.isEnd ? '#10b981' : '#f8fafc';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.char, nodeX, y);
    }

    // --- 6. Graph Renderer ---
    renderGraph(graph) {
        if (!graph) {
            this.clear();
            return;
        }

        let vertices = [];
        try {
            if (graph._vertices && typeof graph._vertices.keys === 'function') {
                vertices = Array.from(graph._vertices.keys());
            } else if (typeof graph.getVerticesCount === 'function') {
                vertices = Array.from({ length: graph.getVerticesCount() }, (_, i) => String(i));
            }
        } catch (e) {
            return;
        }

        if (!vertices.length) {
            this.clear();
            return;
        }

        const width = 600;
        const height = 400;
        this.resize(width, height);
        this.clear();

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 70;
        const nodeRadius = 22;

        const positions = new Map();
        const n = vertices.length;

        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            positions.set(vertices[i], { x, y });
        }

        for (let i = 0; i < n; i++) {
            const u = vertices[i];
            const p1 = positions.get(u);

            for (let j = 0; j < n; j++) {
                if (i === j) continue;
                const v = vertices[j];
                let hasEdge = false;

                if (typeof graph.hasEdge === 'function') {
                    hasEdge = graph.hasEdge(u, v);
                } else if (graph._edges && graph._edges.get(u)) {
                    hasEdge = graph._edges.get(u).has(v);
                }

                if (hasEdge) {
                    const p2 = positions.get(v);
                    this._drawLine(p1.x, p1.y, p2.x, p2.y);
                }
            }
        }

        for (const [v, p] of positions.entries()) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, nodeRadius, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fill();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#f43f5e';
            this.ctx.stroke();

            this.ctx.font = '600 13px "Fira Code", monospace';
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(String(v), p.x, p.y);
        }
    }

    _drawArrow(x1, y1, x2, y2) {
        const headlen = 8;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#94a3b8';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fill();
    }
}
