import { request } from "@playwright/test";
import { getLoginUser } from "../factories/loginUser";
import { faker } from "@faker-js/faker";

export const linkService = (request) => {

    const getToken = async () => {
        const payload = await getLoginUser();
        const response = await request.post('/api/auth/login', {
            data: payload
        });
        const responseBody = await response.json();
        const token = responseBody.data.token;
        return token;
    };

    const createLink = async (payload) => {
        const token = await getToken();
        return await request.post('/api/links', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: payload
        });
    };

    const payloadLink = async () => {
        const payload = {
            original_url: faker.internet.url(),
            title: faker.music.songName()
        };
        return payload;
    };

    return {
        createLink,
        payloadLink
    };

}