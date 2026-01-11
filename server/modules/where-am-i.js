// index.mjs (ESM)
const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
};

function getLocation() {
    const error = new Error();
    const stack = error.stack.split("\n")[3];
    const match = stack.match(/\((.*):(\d+):(\d+)\)/) || stack.match(/at\s+(.*):(\d+):(\d+)/);
    if (!match) return "";
    const [, file, line] = match;
    const fileName = file.split(/[\\/]/).pop();
    return `${colors.cyan}[${fileName}:${line}]${colors.reset}`;
}

export default function wai() {
    const original = { ...console };
    const wrapped = {};

    ["log", "warn", "error", "info"].forEach(method => {
        wrapped[method] = (...args) => {
            const location = getLocation();
            original[method](location, ...args);
        };
    });

    Object.keys(original).forEach(key => {
        if (!wrapped[key]) wrapped[key] = original[key];
    });

    return wrapped;
}

