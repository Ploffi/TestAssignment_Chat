import { faker } from '@faker-js/faker';
import { delay, random } from '../utils.js';

function generateMessages(length) {
    const users = Array.from({ length: 8 }).map(() => ({
        name: faker.name.fullName(),
    }));

    return Array.from({
        length,
    })
        .map(() => ({
            id: faker.datatype.uuid(),
            datetime: faker.date.past(5),
            user: faker.helpers.arrayElement(users),
            content: faker.helpers.arrayElement([
                faker.lorem.words(1),
                faker.lorem.sentence(4),
                faker.lorem.sentence(6),
                faker.lorem.sentence(7),
                faker.lorem.sentence(10),
                faker.lorem.paragraphs(2),
            ]),
        }))
        .sort((a, b) => a.datetime - b.datetime);
}

export class MessageRepository {
    #messages = [];

    constructor() {
        this.#messages = generateMessages(150 * 1000);
    }

    getMessages(offset, limit) {
        // add delay for more realism
        return delay(limit === 0 ? 0 : random(100, 700)).then(() => ({
            messages: this.#messages.slice(offset, offset + limit),
            total: this.#messages.length,
        }));
    }

    addMessage(content, user) {
        const postedMessage = {
            id: faker.datatype.uuid(),
            user,
            content,
            datetime: new Date().toISOString(),
        };

        this.#messages.push(postedMessage);

        return Promise.resolve(postedMessage);
    }
}

export const messageRepository = new MessageRepository();
