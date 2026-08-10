export default function isCodeSafe(code) {
    if (!code || typeof code !== 'string') return false;

    // Block dangerous system operations
    const forbiddenPatterns = [
        /process\./i,
        /child_process/i,
        /require\s*\(/i,
        /import\s*\(/i,
        /exec\s*\(/i,
        /spawn\s*\(/i,
        /fs\./i
    ];

    for (const pattern of forbiddenPatterns) {
        if (pattern.test(code)) {
            return false;
        }
    }

    return true;
}
