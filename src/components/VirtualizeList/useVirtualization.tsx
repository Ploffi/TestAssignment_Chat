import { IVirtualizerProps, Virtualizer } from './Virtualizer';
import { useEffect, useState } from 'react';
import { useRerender } from '../../utils/useRerender';

export function useVirtualization({
    onChange,
    oversizeAmount,
    minElementHeight,
    scrollElement,
    container,
    total,
}: IVirtualizerProps) {
    const rerender = useRerender();
    const [virtualizer, setVirtualizer] = useState<Virtualizer | null>(null);

    useEffect(() => {
        if (!container || !scrollElement || total === undefined) return;

        const innerOnChange = (range: [number, number]) => {
            rerender();
            onChange(range[0], range[1]);
        };

        const virtualizer = new Virtualizer(
            scrollElement,
            container,
            innerOnChange,
            oversizeAmount,
            minElementHeight,
            total,
        );

        setVirtualizer(virtualizer);

        return () => {
            virtualizer.destroy();
        };
    }, [container]);

    useEffect(() => {
        if (!virtualizer) return;
        virtualizer.didUpdate();
    });

    if (!virtualizer) return null;

    return virtualizer;
}
