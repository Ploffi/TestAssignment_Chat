import { IMessage } from '../../models/message';

import './Message.css';

export const MESSAGE_MIN_HEIGHT = 74;

export function Message({ message }: { message: IMessage }) {
    return (
        <div className="message">
            <div className="messageUser">{message.user.name[0]}</div>
            <div className="messageContent">
                <div>{message.content}</div>
                <div className="messageDate">
                    {new Date(message.datetime).toLocaleString(navigator.language, {
                        year: '2-digit',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>
        </div>
    );
}
