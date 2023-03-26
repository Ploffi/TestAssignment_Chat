import { IMessage } from '../models/message';

interface IMessageResponse {
    total: number;
    messages: IMessage[];
}

export function getMessages(page: number, pageSize: number): Promise<IMessageResponse> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());

    return fetch('/api/messages?' + params, {
        headers: {
            'content-type': 'application/json',
        },
    }).then(response => response.json());
}
