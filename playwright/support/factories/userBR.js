import { fakerPT_BR as faker } from '@faker-js/faker';

export const getUser = () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName();

    return {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName, provider: 'dionequevedo.com.br' }).toLowerCase(),
        password: faker.internet.password({ length: 12, memorable: false })
    };
}