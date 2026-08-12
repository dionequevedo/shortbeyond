import { test, expect } from '@playwright/test';

test.describe('Health Check API', () => {

    test('Deve verificar se a API está online e respondendo com status 200', async ({ request }) => {

        const response = await request.get('/health');

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('status');
        expect(responseBody.service).toEqual('shortbeyond-api');
        expect(responseBody.status).toEqual('healthy');

    });

});
