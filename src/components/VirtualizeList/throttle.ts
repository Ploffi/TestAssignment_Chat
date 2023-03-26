export function throttle(fn: Function) {
    let requestId: number | null = null;

    const later = () => {
        requestId = null;
        fn();
    };

    return function () {
        if (requestId !== null) {
            cancelAnimationFrame(requestId);
        }

        requestId = requestAnimationFrame(later);
    };
}
