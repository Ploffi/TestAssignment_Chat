export interface IMessage {
    id: string;
    datetime: string;
    user: {
        name: string;
    };
    content: string;
}
