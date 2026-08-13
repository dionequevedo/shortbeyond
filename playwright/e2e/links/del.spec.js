import { test } from '../../support/fixtures';
import { expect } from '../../support/matchers/ulidMatcher';

test.describe('DELETE /api/links/:id', () => {

    let id;
    test.beforeEach(async ({ links }) => {
        id = await links.getLinkId();
    });

    test('Deve deletar um link existente', async ({ links }) => {
        const response = await links.deleteLink(id);
        expect(response.status()).toBe(200);
        expect(response.statusText()).toBe('OK');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Link excluído com sucesso');
    });

    test('Não deve deletar um link já deletado', async ({ links }) => {
        const response = await links.deleteLink('01KZY6VQ2EARP8GD77M761W8KS');
        expect(response.status()).toBe(404);
        expect(response.statusText()).toBe('Not Found');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Link não encontrado');
    });

});