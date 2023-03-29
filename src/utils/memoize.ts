export function memo<TDeps extends readonly any[], TResult>(
    getDeps: () => [...TDeps],
    fn: (...args: TDeps) => TResult,
) {
    let deps = [] as any;
    let result: TResult;

    return (): TResult => {
        const newDeps = getDeps();

        const depsChanged =
            newDeps.length !== deps.length || newDeps.some((dep: any, index: number) => !Object.is(dep, deps[index]));

        if (!depsChanged) {
            return result;
        }

        deps = newDeps;

        result = fn(...newDeps);

        return result!;
    };
}
