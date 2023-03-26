import React, { useEffect, useRef, useState } from 'react';
import { getMessages } from '../../services/messageApi';
import { IMessage } from '../../models/message';
import { Message, MESSAGE_MIN_HEIGHT } from './Message';

import { VirtualizeList } from '../VirtualizeList/VirtualizeList';

import './Messages.css';

const OVERSIZE_ELEMENTS = 10;
const PAGE_SIZE = 1500;

function useMessages() {
    const [messages, setMessages] = useState<IMessage[]>([]);
    let loadRef = useRef(false);
    useEffect(() => {
        if (loadRef.current) return;
        loadRef.current = true;
        getMessages(1, PAGE_SIZE).then(response => setMessages(messages => messages.concat(response.messages.reverse())));
    }, []);

    return messages;
}

export function Messages() {
    const messages = useMessages();

    return (
        <div className="messagesWrapper">
            <VirtualizeList
                getKey={idx => messages[idx].id}
                total={messages.length}
                onChange={console.log}
                elementClassName="messageWrapper"
                oversizeAmount={OVERSIZE_ELEMENTS}
                minElementHeight={MESSAGE_MIN_HEIGHT}
            >
                {idx => <Message message={messages[idx]} />}
            </VirtualizeList>
        </div>
    );
}
