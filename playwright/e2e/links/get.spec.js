import { test } from '../../support/fixtures';
import { expect } from '../../support/matchers/ulidMatcher';

test.describe('GET /api/links', () => {

    test('Deve listar todos os links', async ({ links }) => {
        const response = await links.getLinks();
        expect(response.status()).toBe(200);
        expect(response.statusText()).toBe('OK');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('count', Number, { min: 1, max: 100 });
        expect(responseBody.count).toBe(responseBody.data.length);
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data).Array;
        // Validar a estrutura de cada item da lista
        for (const link of responseBody.data) {
            expect(link).toHaveProperty('id');
            expect(link.id).toBeULID();
            expect(link).toHaveProperty('original_url');
            expect(link.original_url).String;
            expect(link).toHaveProperty('short_code');
            expect(link.short_code).String;
            expect(link.short_code).toHaveLength(5);
            expect(link).toHaveProperty('title');
            expect(link.title).String;
        }
        expect(responseBody).toHaveProperty('message', 'Links Encurtados');
    });

    test('Não deve buscar um link com token inválido', async ({ links }) => {
        const response = await links.getLinks('invalidToken');
        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe('Unauthorized');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'token is malformed: token contains an invalid number of segments');
    });

    test('Não deve buscar um link sem token', async ({ links }) => {
        const response = await links.getLinks(null);
        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe('Unauthorized');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Header Authorization é obrigatório');
    });

});