# JS Playground

> **Interactive JavaScript Developer Sandbox & Data Structure Visualizer**  
> Powered by Monaco Editor, `@datastructures-js`, and dual execution sandboxes (`isolated-vm` + Web Workers).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Express](https://img.shields.io/badge/express-v5.2.1-informational.svg)
![Monaco Editor](https://img.shields.io/badge/monaco--editor-v0.45.0-blueviolet.svg)

---

## Highlights & Features

* **Monaco Editor Integration**: Features VS Code's editor engine with syntax highlighting, custom formatting, and code completion.
* **Native `@datastructures-js` Suite**: Natively includes industry-standard data structures:
  * **Trees**: `BinarySearchTree`, `AvlTree`
  * **Queues & Heaps**: `MinPriorityQueue`, `MaxPriorityQueue`, `PriorityQueue`, `Queue`, `Stack`
  * **Lists**: `LinkedList`, `DoublyLinkedList`, `ListNode`
  * **Search & Graphs**: `Trie`, `Graph`, `DirectedGraph`, `TreeNode`
* **Dynamic Monaco IntelliSense (`/api/types`)**: Real-time TypeScript autocompletion, signature hints, and hover docs.
* **Dual Execution Sandboxes**:
  * **V8 Isolate Sandbox (`isolated-vm`)**: Secure server-side execution with strict memory limits (64MB) and runtime timeouts (5s) to block malicious operations (`process`, `require`, infinity loops).
  * **Web Worker Sandbox**: Zero-latency client-side execution running locally inside browser web workers.
* **Universal Canvas Visualizer Engine**: Renders interactive HTML5 Canvas graphics for Trees, Linked Lists, Priority Queues, Stacks, Queues, Tries, and Graphs.
* **Multi-Structure Switcher**: Automatically detects user-declared data structure variables and provides instant chip tabs to switch canvas visualizers.
* **Real-time Performance Metrics**: Displays execution time in milliseconds and JS heap memory consumption in megabytes.
* **1-Click Code Presets**: Verified templates for Binary Search Trees, AVL Trees, Priority Queues, Graphs, Tries, and LeetCode problem solving.

---

## Production Project Architecture

```
js-playground/
├── server/                        # Backend Application & Sandboxing
│   ├── app.js                     # Express app setup & server launcher
│   ├── routes/                    # API endpoints (/api/types, /execute)
│   ├── sandbox/                   # V8 isolate manager (isolated-vm context setup)
│   └── utils/                     # Code security validator (isCodeSafe)
│
├── src/                           # Frontend Build Source Inputs
│   ├── bundle/                    # Data Structures Bundle Entry
│   │   └── ds-entry.js            # Exports @datastructures-js + ListNode/TreeNode
│   ├── visualizer/                # Universal Visualizer Engine
│   │   └── visualizerEngine.js    # Canvas rendering engine
│   └── worker/                    # Web Worker Execution Script
│       └── workerEntry.js         # Dedicated Web Worker source
│
├── public/                        # Production Static Assets & Compiled Outputs
│   ├── css/                       # Glassmorphic Dark IDE Styling System
│   ├── dist/                      # esbuild output targets
│   │   ├── ds-bundle.min.js       # Isomorphic Data Structures bundle
│   │   └── worker-bundle.min.js   # Compiled Web Worker bundle
│   ├── scripts/                   # Production client modules
│   │   ├── editor.js              # Monaco setup & typings loader
│   │   └── visualizerEngine.js    # Client visualizer script
│   └── index.html                 # Clean SPA interface
│
├── build.js                       # Universal esbuild compilation script
├── package.json                   # Dependencies, build scripts & metadata
└── README.md                      # Open-Source Showcase Documentation
```

---

## Quick Start & Installation

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm**

### Installation Steps

1. **Clone repository**:
   ```bash
   git clone https://github.com/madhuragrawal/js-playground.git
   cd js-playground
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build Data Structure bundles**:
   ```bash
   npm run build:ds
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3005` in your web browser.

---

## API Documentation

### `GET /api/types`
Returns bundled TypeScript ambient declarations (`.d.ts`) for `@datastructures-js` and helper classes to provide Monaco Editor with native autocompletion.

### `POST /execute`
Executes untrusted JavaScript code safely inside a V8 Isolate sandbox.

#### Request Body
```json
{
  "code": "const bst = new BinarySearchTree(); bst.insert(10); console.log(bst.root().getValue());"
}
```

#### Response
```json
{
  "output": "10",
  "executionTime": "1.25 ms",
  "memoryUsed": "0.85 MB"
}
```

---

## Technology Stack

* **Frontend**: HTML5 Canvas, Vanilla CSS (Glassmorphic Dark Theme), ES Modules, Monaco Editor
* **Backend**: Node.js, Express 5, `isolated-vm`
* **Data Structures**: `@datastructures-js` (`binary-search-tree`, `priority-queue`, `linked-list`, `trie`, `graph`, `queue`, `stack`)
* **Bundler**: `esbuild`

---

## License

Distributed under the MIT License. See `LICENSE` for details.

Developed by [Madhur Agrawal](https://github.com/madhuragrawal).
