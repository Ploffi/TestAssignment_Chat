import { useState, useCallback } from 'react';

export function useRerender() {
    const [_, rerender] = useState(0);
    return useCallback(() => {
        rerender(s => s + 1);
    }, []);
}
