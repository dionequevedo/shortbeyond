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

    const getLinks = async (customToken) => {
        const headers = {};
        let token;
        if (customToken === undefined) {
            token = await getToken();
            headers['Authorization'] = `Bearer ${token}`;
        } else if (customToken === 'invalidToken') {
            token = 'invalidToken';
            headers['Authorization'] = `Bearer ${customToken}`;
        } else if (customToken === null) {
            headers[null];
        }

        return await request.get('/api/links', {
            headers,
        });
    };

    const payloadLink = () => {
        const payload = {
            //original_url: faker.internet.url(),
            original_url: 'https://www.github.com',
            title: faker.music.songName()
        };
        return payload;
    };

    const getLinkId = async () => {
        const headers = {};
        const token = await getToken();
        headers['Authorization'] = `Bearer ${token}`;

        const response = await request.get(`/api/links`, {
            headers,
        });

        const responseBody = await response.json();
        return responseBody.data[0].id;
    };

    const getCode = async () => {
        let code;
        const headers = {};
        const token = await getToken();
        headers['Authorization'] = `Bearer ${token}`;

        const response = await request.get(`/api/links`, {
            headers,
        });

        const responseBody = await response.json();
        code = responseBody.data[0].short_code;

        return code;
    };

    const deleteLink = async (id) => {
        const headers = {};
        const token = await getToken();
        headers['Authorization'] = `Bearer ${token}`;

        return await request.delete(`/api/links/${id}`, {
            headers
        });
    };

    const redirect = async (code) => {

        return await request.get(`/${code}`);
    };

    return {
        createLink,
        payloadLink,
        getLinks,
        getLinkId,
        deleteLink,
        getCode,
        redirect
    };

}