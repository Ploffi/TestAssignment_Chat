import React, { useEffect, useRef, useState } from 'react';
import { getMessages, getMessagesLength } from '../../services/messageApi';
import { IMessage } from '../../models/message';
import { Message, MESSAGE_MIN_HEIGHT } from './Message';
import { VirtualizeList } from '../VirtualizeList/VirtualizeList';
import { Skeleton } from '../Skeleton/Skeleton';
import { useRerender } from '../../utils/useRerender';

import './Messages.css';
import { throttle } from '../../utils/throttle';

const OVERSIZE_ELEMENTS = 10;
const PAGE_SIZE = OVERSIZE_ELEMENTS * 3;

function getPageToProcess(start: number, end: number, processedPages: Set<number>): [number, number] | null {
    let startPage = Math.floor(start / PAGE_SIZE);
    let endPage = Math.floor(end / PAGE_SIZE);

    while (processedPages.has(startPage) && startPage < endPage) {
        startPage++;
    }

    while (processedPages.has(endPage) && startPage < endPage) {
        endPage--;
    }

    if (startPage === endPage && processedPages.has(startPage)) {
        return null;
    }

    return [startPage, endPage];
}

function useMessages() {
    // store message by their order number
    const [messagesMap] = useState(() => new Map<number, IMessage>());
    // store loaded pages of numbers
    const [processedPages] = useState(() => new Set<number>());
    const rerender = useRerender();
    const [total, setTotal] = useState<number | undefined>();

    const handleRangeChange = React.useMemo(
        () =>
            throttle((startRange: number, endRange: number) => {
                const pages = getPageToProcess(startRange, endRange, processedPages);
                if (pages === null) return;
                const [startPage, endPage] = pages;
                const offset = startPage * PAGE_SIZE;
                const limit = (endPage - startPage + 1) * PAGE_SIZE;

                for (let page = startPage; page <= endPage; page++) {
                    processedPages.add(page);
                }

                getMessages(offset, limit)
                    .then(messages => {
                        messages.forEach((message, idx) => {
                            messagesMap.set(offset + idx, message);
                        });
                        rerender();
                    })
                    .catch(() => {
                        for (let page = startPage; page <= endPage; page++) {
                            processedPages.delete(page);
                        }
                    });
            }, 200),
        [],
    );

    useEffect(() => {
        getMessagesLength().then(setTotal);
    }, []);

    return {
        messages: messagesMap,
        total,
        onRangeChange: handleRangeChange,
    };
}

export const MESSAGE_MIN_HEIGHT_WITH_MARGIN = MESSAGE_MIN_HEIGHT + 16;

export function Messages() {
    const { messages, total, onRangeChange } = useMessages();

    const scrollElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollElementRef.current) return;
        scrollElementRef.current!.scrollTo(0, scrollElementRef.current!.scrollHeight);
    }, [scrollElementRef.current]);

    return (
        <div className="messagesWrapper">
            <VirtualizeList
                getKey={idx => messages.get(idx)?.id || idx}
                total={total}
                onChange={onRangeChange}
                elementClassName="messageWrapper"
                oversizeAmount={OVERSIZE_ELEMENTS}
                minElementHeight={MESSAGE_MIN_HEIGHT_WITH_MARGIN}
                scrollElementRef={scrollElementRef}
            >
                {idx => {
                    const message = messages.get(idx);

                    return {
                        element: message ? <Message message={message} /> : <Skeleton height={MESSAGE_MIN_HEIGHT} />,
                        ready: Boolean(message),
                    };
                }}
            </VirtualizeList>
        </div>
    );
}
