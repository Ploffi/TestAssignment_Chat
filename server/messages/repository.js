import { faker } from '@faker-js/faker';

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
        this.#messages = generateMessages(150);
    }

    getMessages(page, pageSize) {
        const startIdx = (page - 1) * pageSize;
        return Promise.resolve({
            messages: this.#messages.slice(startIdx, startIdx + pageSize),
            total: this.#messages.length,
        });
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
