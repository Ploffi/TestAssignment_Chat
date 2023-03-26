import { IVirtualizerProps, Virtualizer } from './Virtualizer';
import { useEffect, useState } from 'react';

export function useVirtualization({
    onChange,
    oversizeAmount,
    minElementHeight,
    scrollableElement,
    container,
    total,
}: IVirtualizerProps) {
    const [_, setState] = useState(0);
    const [virtualizer, setVirtualizer] = useState<Virtualizer | null>(null);

    useEffect(() => {
        if (!container || !scrollableElement || total === undefined) return;

        const innerOnChange = (range: [number, number]) => {
            setState(i => i + 1);
            onChange(range[0], range[1]);
        };
        const virtualizer = new Virtualizer(
            scrollableElement,
            container,
            innerOnChange,
            oversizeAmount,
            minElementHeight,
            total,
        );

        function scrollToLast() {
            if (
                !scrollableElement ||
                Math.abs(
                    scrollableElement.scrollTop + scrollableElement.offsetHeight - scrollableElement.scrollHeight,
                ) < 1
            )
                return;
            scrollableElement.scroll(0, scrollableElement.scrollHeight);
            requestAnimationFrame(scrollToLast);
        }

        scrollToLast();

        setVirtualizer(virtualizer);

        return () => {
            virtualizer.destroy();
        };
    }, [container]);

    if (!virtualizer) return null;

    return {
        refElement: virtualizer.handleCreateElement,
        getElements: virtualizer.getElements,
    };
}
