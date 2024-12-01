// Function to validate the user code
function isCodeSafe(code) {
    const unsafePatterns = [
        /require\s*\(/,  // disallow require statements
        /process\s*\./,  // disallow access to process
        /child_process/, // disallow child process
        /exec\s*\(/,     // disallow exec calls
    ];
    return !unsafePatterns.some(pattern => pattern.test(code));
}

export default isCodeSafe;