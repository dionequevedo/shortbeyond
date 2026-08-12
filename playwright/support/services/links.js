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

    const createLink = async (payload, customToken) => {
        const headers = {};

        if (customToken === undefined) {
            const token = await getToken();
            headers['Authorization'] = `Bearer ${token}`;
        } else if (customToken) {
            headers['Authorization'] = `Bearer ${customToken}`;
        }

        return await request.post('/api/links', {
            headers,
            data: payload
        });
    };

    const payloadLink = () => {
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