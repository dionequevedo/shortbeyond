import { test } from '@playwright/test';
import { expect } from '../../support/matchers/jwtMatcher';
import { linkService } from '../../support/services/links';

test.describe('POST /api/links', () => {

    let links;
    let payload;

    test.beforeEach(({ request }) => {

        links = linkService(request);
        payload = links.payloadLink();

    });

    test('Deve cadastrar um novo link', async () => {
        const response = await links.createLink(payload);

        expect(response.status()).toBe(201);
        expect(response.statusText()).toBe('Created');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(responseBody).toHaveProperty('message', 'Link criado com sucesso');
        expect(responseBody.data).toHaveProperty('id');
        expect(responseBody.data.id).toBeULID();
        expect(responseBody.data).toHaveProperty('original_url', payload.original_url);
        expect(responseBody.data).toHaveProperty('short_code');
        expect(responseBody.data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
        expect(responseBody.data).toHaveProperty('title', payload.title);
    });

    test('Não deve cadastrar um novo link com URL inválida', async () => {
        const response = await links.createLink({ ...payload, original_url: 'url-invalida' });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'OriginalURL\' deve ser uma URL válida');
    });

    test('Não deve cadastrar um novo link com título inválido', async () => {
        const response = await links.createLink({ ...payload, title: '' });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'Title\' é obrigatório');
    });

    test('Não deve cadastrar um novo link sem título', async () => {
        const response = await links.createLink({ ...payload, title: '' });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'Title\' é obrigatório');
    });

    test('Não deve cadastrar um novo link sem URL_original', async () => {
        const response = await links.createLink({ ...payload, original_url: null });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'OriginalURL\' é obrigatório');
    });

    test('Não deve cadastrar um novo link com URL_original e título inválidos', async () => {
        const response = await links.createLink({ ...payload, original_url: null, title: null });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'O campo \'OriginalURL\' é obrigatório');
    });

    test('Não deve cadastrar um novo link sem informar o token', async () => {
        const response = await links.createLink(payload, null);

        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe('Unauthorized');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Header Authorization é obrigatório');
    });

});
