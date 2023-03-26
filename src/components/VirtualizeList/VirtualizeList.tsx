import React from 'react';

import './VirtualizeList.css';
import { useVirtualization } from './useVirtualization';

interface IVirtualizeListProps {
    onChange: (start: number, end: number) => void;
    elementClassName?: string;
    total: number | undefined;
    children: (idx: number) => React.ReactNode;
    getKey: (idx: number) => string | number;
    minElementHeight: number;
    oversizeAmount: number;
}

export function VirtualizeList({
    elementClassName,
    onChange,
    total,
    children,
    getKey,
    minElementHeight,
    oversizeAmount,
}: IVirtualizeListProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollableRef = React.useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualization({
        onChange: onChange,
        oversizeAmount,
        minElementHeight: minElementHeight,
        container: containerRef.current,
        scrollableElement: scrollableRef.current,
        total,
    });

    const range = virtualizer ? virtualizer.getElements() : null;

    return (
        <div className="scrollElement" ref={scrollableRef}>
            <div ref={containerRef}>
                {range && virtualizer ? (
                    <div
                        className="virtualizeList"
                        style={{
                            transform: `translateY(${range[0].start}px)`,
                        }}
                    >
                        {range.map(({ idx }) => {
                            return (
                                <div
                                    className={elementClassName}
                                    ref={virtualizer.refElement}
                                    data-virtualized-idx={idx}
                                    key={getKey(idx)}
                                >
                                    {children(idx)}
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
