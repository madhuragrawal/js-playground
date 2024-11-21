export default `

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
        return '[Error: ' + value.message + ']';
    }

    // Arrays
    if (Array.isArray(value)) {
        visited.add(value);
        const formattedArray = '[ ' + value.map(function (item) { return formatValue(item, visited); }).join(', ') + ' ]';
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
        const formattedSet = 'Set { ' + Array.from(value).map(function (item) { return formatValue(item, visited); }).join(', ') + ' }';
        visited.delete(value);
        return formattedSet;
    }

    // Map
    if (value instanceof Map) {
        visited.add(value);
        const formattedMap = 'Map { ' + Array.from(value.entries())
            .map(function ([k, v]) {
                return formatValue(k, visited) + ' => ' + formatValue(v, visited);
            })
            .join(', ') + ' }';
        visited.delete(value);
        return formattedMap;
    }

    // Objects
    if (typeof value === 'object') {
        visited.add(value);
        const formattedObject = '{ ' + Object.keys(value)
            .map(function (key) {
                return key + ': ' + formatValue(value[key], visited);
            })
            .join(', ') + ' }';
        visited.delete(value);
        return formattedObject;
    }

    // Default fallback
    return String(value);
}

globalThis.console = {
    log: function () {
        const formattedArgs = Array.from(arguments).map(function (arg) { return formatValue(arg); });
        output.push(formattedArgs.join(' '));
    }
};

`;