export function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function random(min, max) {
    return Math.floor((max - min) * Math.random()) + min;
}
