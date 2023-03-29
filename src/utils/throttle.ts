export function throttle(fn: Function, wait: number) {
    let lastCalled: number;
    let timeout: number;

    return function (...args: unknown[]) {
        const now = Date.now();
        const diff = lastCalled + wait - now;

        if (lastCalled && diff > 0) {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                lastCalled = now;
                fn(...args);
            }, diff);
        } else {
            lastCalled = now;
            fn(...args);
        }
    };
}
