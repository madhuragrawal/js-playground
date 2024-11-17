export const consoleScript = `
    function formatValue(value, visited = new Set()) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (visited.has(value)) return '[Circular]';
        
        // Primitive types
        if (typeof value === 'string') return '"' + value + '"';
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);
        if (typeof value === 'bigint') return value.toString() + 'n';
        if (typeof value === 'symbol') return value.toString();
        
        // Functions
        if (typeof value === 'function') {
            return '[Function' + (value.name ? ': ' + value.name : '') + ']';
        }

        // Error objects
        if (value instanceof Error) {
            return \`[Error: \${value.message}]\`;
        }

        // Arrays
        if (Array.isArray(value)) {
            visited.add(value);  // Track the array to avoid circular references
            const formattedArray = '[ ' + value.map(item => formatValue(item, visited)).join(', ') + ' ]';
            visited.delete(value);
            return formattedArray;
        }

        // Typed arrays
        if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
            return value.constructor.name + ' [ ' + Array.from(value).join(', ') + ' ]';
        }

        // Set
        if (value instanceof Set) {
            visited.add(value);
            const formattedSet = 'Set { ' + Array.from(value).map(item => formatValue(item, visited)).join(', ') + ' }';
            visited.delete(value);
            return formattedSet;
        }

        // Map
        if (value instanceof Map) {
            visited.add(value);
            const formattedMap = 'Map { ' + Array.from(value.entries())
                .map(([k, v]) => \`\${formatValue(k, visited)} => \${formatValue(v, visited)}\`)
                .join(', ') + ' }';
            visited.delete(value);
            return formattedMap;
        }

        // Objects
        if (typeof value === 'object') {
            visited.add(value);
            const formattedObject = '{ ' + Object.keys(value)
                .map(key => \`\${key}: \${formatValue(value[key], visited)}\`)
                .join(', ') + ' }';
            visited.delete(value);
            return formattedObject;
        }

        // Default fallback
        return String(value);
    }

    globalThis.console = {
        log: (...args) => {
            const formattedArgs = args.map(arg => formatValue(arg));
            output.push(formattedArgs.join(' ')); // Push formatted output
        }
    };
`;

