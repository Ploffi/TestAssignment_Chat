import { IMessage } from '../../models/message';

import './Message.css';

export const MESSAGE_MIN_HEIGHT = 74;

export function Message({ message }: { message: IMessage }) {
    return (
        <div className="message">
            <div className="messageInfo">
                <div>{message.user.name}</div>
                <div>[{new Date(message.datetime).toLocaleDateString()}]:</div>
            </div>
            <div>{message.content}</div>
        </div>
    );
}
