import { test } from "../../support/fixtures";
import { expect } from "../../support/matchers/ulidMatcher";

test.describe('GET /api/links/{code}', () => {

    let code;
    test.beforeEach(async ({ links }) => {
        code = await links.getCode();
    });

    test('Deve redirecionar para o link original', async ({ links }) => {
        const response = await links.redirect(code);
        expect(response.status()).toBe(200);
        expect(response.statusText()).toBe('OK');
        // 1. Validar que o cabeçalho Content-Type é HTML
        expect(response.headers()['content-type']).toContain('text/html');
        // 2. Obter o corpo como texto e validar a estrutura HTML
        const html = await response.text();
        expect(html.toLowerCase()).toContain('<!doctype html>');
    });

    test('Não deve redirecionar para um link inexistente', async ({ links }) => {
        const response = await links.redirect('invalidCode');
        expect(response.status()).toBe(404);
        expect(response.statusText()).toBe('Not Found');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Link não encontrado');
    });

});