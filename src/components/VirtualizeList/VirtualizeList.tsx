import React from 'react';

import './VirtualizeList.css';
import { useVirtualization } from './useVirtualization';

interface IVirtualizeListProps {
    onChange: (start: number, end: number) => void;
    elementClassName?: string;
    total: number | undefined;
    children: (idx: number) => { element: React.ReactNode; ready: boolean };
    getKey: (idx: number) => string | number;
    minElementHeight: number;
    oversizeAmount: number;
    scrollElementRef: React.RefObject<HTMLDivElement>;
}

export function VirtualizeList({
    elementClassName,
    onChange,
    total,
    children,
    getKey,
    minElementHeight,
    oversizeAmount,
    scrollElementRef,
}: IVirtualizeListProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualization({
        onChange: onChange,
        oversizeAmount,
        minElementHeight: minElementHeight,
        container: containerRef.current,
        scrollElement: scrollElementRef.current,
        total,
    });

    const range = virtualizer ? virtualizer.getElements() : null;

    return (
        <div className="scrollElement" ref={scrollElementRef}>
            <div style={{ height: virtualizer?.getTotalHeight() }} ref={containerRef}>
                {range && virtualizer ? (
                    <div
                        className="virtualizeList"
                        style={{
                            transform: `translateY(${range[0].start}px)`,
                        }}
                    >
                        {range.map(({ idx }) => {
                            const { ready, element } = children(idx);
                            return (
                                <div
                                    className={elementClassName}
                                    ref={virtualizer?.handleCreateElement}
                                    data-virtualized-idx={idx}
                                    data-virtualized-ready={ready}
                                    key={getKey(idx)}
                                >
                                    {element}
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
