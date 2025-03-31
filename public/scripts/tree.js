export class Visualizer {
    constructor(c) {
        this.c = c;
        this.textScale = 2;
        this.textSize = Visualizer.BASE_TEXT_SIZE * this.textScale;
        this.radius = this.textSize + Visualizer.BASE_PADDING * 2;
        this.initialVerticalSpacing = this.radius + Visualizer.BASE_PADDING;
        this.verticalSpacing = this.radius * 2 + this.textSize;
        this.qualityScale = 2;
        this.lineWidth = Visualizer.BASE_LINE_WIDTH * this.textScale;
    }
    resizeHeight(heightNodes) {
        const actualHeight = heightNodes * (3 * Visualizer.BASE_TEXT_SIZE + 4 * Visualizer.BASE_PADDING) +
            Visualizer.BASE_TEXT_SIZE + 3 * Visualizer.BASE_PADDING;
        this.resize(innerWidth, actualHeight);
    }
    resizeWidth(width) {
        if (this.c.width == width)
            return;
        this.resize(width + Visualizer.BASE_PADDING, this.c.height / this.qualityScale);
    }
    resize(width, height) {
        this.c.setAttribute("style", `width: ${width}px; height: ${height}px;`);
        this.c.height = height * this.qualityScale;
        this.c.width = width * this.qualityScale;
        this.ctx = this.c.getContext("2d");
        this.ctx.font = `${this.textSize}px arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }
    drawNode(node) {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }
        let { x, y } = node.position;
        const singleText = node.valueActual === node.valueExpected;
        let actualTextWidth = this.getWidth(node.valueActual);
        let expectedTextWidth = singleText ? 0 : this.getWidth(node.valueExpected);
        let totalWidth = actualTextWidth + expectedTextWidth;
        this.ctx.fillStyle = "white";
        if (node.valueActual === node.valueExpected) {
            this.ctx.fillText(node.valueActual, x, y);
        }
        else if (!node.valueExpected) {
            this.ctx.fillStyle = "red";
            this.ctx.fillText(node.valueActual, x, y);
            this.ctx.fillStyle = "black";
        }
        else if (!node.valueActual) {
            this.ctx.fillStyle = "LimeGreen";
            this.ctx.fillText(node.valueExpected, x, y);
            this.ctx.fillStyle = "black";
        }
        else {
            const actualX = x - expectedTextWidth / 2 - Visualizer.BASE_PADDING;
            const expectedX = x + actualTextWidth / 2 + Visualizer.BASE_PADDING;
            this.ctx.fillStyle = "red";
            this.ctx.fillText(node.valueActual, actualX, y);
            this.ctx.fillStyle = "LimeGreen";
            this.ctx.fillText(node.valueExpected, expectedX, y);
            this.ctx.fillStyle = "black";
            totalWidth += 4;
        }
        const circle = this.textSize * 2;
        if (totalWidth <= circle) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
            this.ctx.strokeStyle = 'white';
            this.ctx.stroke();
        }
        else {
            let additionalShift = (totalWidth - circle) / 2.;
            this.ctx.beginPath();
            this.ctx.arc(x - additionalShift, y, this.radius, Math.PI / 2, Math.PI * 3 / 2);
            this.ctx.lineTo(x + additionalShift, y - this.radius);
            this.ctx.arc(x + additionalShift, y, this.radius, -Math.PI / 2, -Math.PI * 3 / 2);
            this.ctx.lineTo(x - additionalShift, y + this.radius);
            this.ctx.stroke();
        }
    }
    getWidth(value) {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }
        return value ? this.ctx.measureText(value).width : 0;
    }
    getInnerWidth(node) {
        const singleText = node.valueActual === node.valueExpected;
        if (singleText) {
            return this.getWidth(node.valueActual);
        }
        return this.getWidth(node.valueActual) + this.getWidth(node.valueExpected);
    }
    getOuterWidth(node) {
        return Math.max(this.radius * 2, this.getInnerWidth(node) + Visualizer.BASE_PADDING);
    }
    drawNodeLink(parent, child) {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }
        let { x: x1, y: y1 } = parent.position;
        let { x: x2, y: y2 } = child.position;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1 + this.radius);
        this.ctx.lineTo(x2, y2 - this.radius);
        this.ctx.stroke();
    }
}
Visualizer.BASE_TEXT_SIZE = 16;
Visualizer.BASE_LINE_WIDTH = 1;
Visualizer.BASE_PADDING = 2;
export class TreeNode {
    constructor(valueActual, valueExpected) {
        this.valueActual = valueActual;
        this.valueExpected = valueExpected;
        this.position = { x: 0, y: 0 };
    }
}
export class Tree {
    constructor(visualizer) {
        this.visualizer = visualizer;
    }
    build(chunksActual, chunksExpected) {
        this.root = new TreeNode(chunksActual === null || chunksActual === void 0 ? void 0 : chunksActual[0], undefined);
        let actualNodes = [this.root];
        for (let i = 1, api = 0; i < ((chunksActual === null || chunksActual === void 0 ? void 0 : chunksActual.length) || 0); i += 2, api++) {
            let parent = actualNodes[api];
            if ((chunksActual === null || chunksActual === void 0 ? void 0 : chunksActual[i]) !== "null") {
                let leftNode = new TreeNode(chunksActual === null || chunksActual === void 0 ? void 0 : chunksActual[i], undefined);
                parent.left = leftNode;
                actualNodes.push(leftNode);
            }
            if (i + 1 === (chunksActual === null || chunksActual === void 0 ? void 0 : chunksActual.length) || (chunksActual === null || chunksActual === void 0 ? void 0 : chunksActual[i + 1]) === "null")
                continue;
            let rightNode = new TreeNode(chunksActual === null || chunksActual === void 0 ? void 0 : chunksActual[i + 1], undefined);
            parent.right = rightNode;
            actualNodes.push(rightNode);
        }
        this.root.valueExpected = chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected[0];
        let expectedNodes = [this.root];
        for (let i = 1, pi = 0; i < ((chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected.length) || 0); i += 2, pi++) {
            let parent = expectedNodes[pi];
            if ((chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected[i]) !== "null") {
                let leftNode = parent.left;
                if (leftNode) {
                    leftNode.valueExpected = chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected[i];
                }
                else {
                    leftNode = new TreeNode(undefined, chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected[i]);
                    parent.left = leftNode;
                }
                expectedNodes.push(leftNode);
            }
            if (i + 1 === (chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected.length) || (chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected[i + 1]) === "null")
                continue;
            let rightNode = parent.right;
            if (rightNode) {
                rightNode.valueExpected = chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected[i + 1];
            }
            else {
                rightNode = new TreeNode(undefined, chunksExpected === null || chunksExpected === void 0 ? void 0 : chunksExpected[i + 1]);
                parent.right = rightNode;
            }
            expectedNodes.push(rightNode);
        }
        this.visualizer.resizeHeight(this.findDepth(this.root));
        this.reposition();
        this.visualizer.resizeWidth(this.findWidth(this.root));
        this.breadthFirstDraw();
    }
    findDepth(node) {
        if (!node)
            return 0;
        return 1 + Math.max(this.findDepth(node.left), this.findDepth(node.right));
    }
    findWidth(node) {
        if (!node)
            return 0;
        const currentWidth = (node.position.x + this.visualizer.getOuterWidth(node) / 2.) / this.visualizer.qualityScale;
        return Math.max(currentWidth, this.findWidth(node.left), this.findWidth(node.right));
    }
    breadthFirstDraw() {
        if (!this.root)
            return;
        let queue = [];
        queue.push(this.root);
        while (queue.length !== 0) {
            let node = queue.shift();
            this.visualizer.drawNode(node);
            if (node.left) {
                this.visualizer.drawNodeLink(node, node.left);
                queue.push(node.left);
            }
            if (node.right) {
                this.visualizer.drawNodeLink(node, node.right);
                queue.push(node.right);
            }
        }
    }
    reposition() {
        this.fillPositions(this.root, 0, [], true);
    }
    fillPositions(node, h, hToRightmostX, leanLeft) {
        if (!node)
            return;
        hToRightmostX[h] = Math.max(hToRightmostX[h] || 0, (hToRightmostX[h - 1] || 0) + (leanLeft ? -this.visualizer.radius / 2 : this.visualizer.radius / 2));
        let left = this.fillPositions(node.left, h + 1, hToRightmostX, true);
        let right = this.fillPositions(node.right, h + 1, hToRightmostX, false);
        node.position.y = h * this.visualizer.verticalSpacing + this.visualizer.initialVerticalSpacing;
        let horizontalShift = this.visualizer.getOuterWidth(node) / 2;
        if (!left && !right) {
            node.position.x = Math.max((hToRightmostX[h] || 0) + horizontalShift + this.visualizer.radius / 2);
        }
        else if (left && right) {
            node.position.x = (node.left.position.x + node.right.position.x) / 2;
        }
        else if (left && !right) {
            node.position.x = node.left.position.x + this.visualizer.radius / 2;
        }
        else if (!left && right) {
            node.position.x = hToRightmostX[h] + this.visualizer.radius + this.visualizer.radius / 2;
            node.position.x = (node.position.x + right.position.x - this.visualizer.radius / 2) / 2;
        }
        hToRightmostX[h] = node.position.x + horizontalShift;
        return node;
    }
}