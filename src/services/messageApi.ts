import { IMessage } from '../models/message';

interface IMessageResponse {
    total: number;
    messages: IMessage[];
}

function getMessagesInternal(offset: number, limit: number): Promise<IMessageResponse> {
    const params = new URLSearchParams();
    params.set('offset', offset.toString());
    params.set('limit', limit.toString());

    return fetch('/api/messages?' + params, {
        headers: {
            'content-type': 'application/json',
        },
    }).then(response => response.json());
}

export function getMessages(offset: number, limit: number): Promise<IMessage[]> {
    return getMessagesInternal(offset, limit).then(r => r.messages);
}

export function getMessagesLength(): Promise<number> {
    return getMessagesInternal(0, 0).then(r => r.total);
}
