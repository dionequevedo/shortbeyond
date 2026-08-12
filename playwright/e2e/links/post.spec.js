import { test } from '@playwright/test';
import { expect } from '../../support/matchers/jwtMatcher';
import { linkService } from '../../support/services/links';

test.describe('POST /api/links', () => {

    let links;

    test.beforeEach(({ request }) => {

        links = linkService(request);

    });

    test('Deve cadastrar um novo link', async () => {
        const payload = await links.payloadLink();
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

});
