import { test } from '@playwright/test';
import { expect } from '../../support/matchers/jwtMatcher';
import { expect as ulidExpect } from '../../support/matchers/ulidMatcher';
import { authService } from '../../support/services/auth';
import { getLoginUser } from '../../support/factories/loginUser';

test.describe('POST /api/auth/login', () => {

    let login;

    test.beforeEach(({ request }) => {

        login = authService(request);

    });

    test('Deve logar com sucesso', async () => {

        const payload = getLoginUser();

        const response = await login.loginUser(payload);

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data).toHaveProperty('token');
        expect(responseBody.data.token).toBeJWT();
        expect(responseBody.data).toHaveProperty('user');
        expect(responseBody.data.user).toHaveProperty('id');
        ulidExpect(responseBody.data.user.id).toBeULID();
        expect(responseBody.data.user).toHaveProperty('name');
        expect(responseBody.data.user).toHaveProperty('email', payload.email);
        expect(responseBody).toHaveProperty('message', 'Login realizado com sucesso');

    });

    test('Não deve logar com email inválido', async () => {

        const payload = getLoginUser();

        const response = await login.loginUser({ ...payload, email: 'invalidEmail@invalid.com' });

        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe('Unauthorized');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Credenciais inválidas');

    });

    test('Não deve logar sem email preenchido', async () => {

        const payload = getLoginUser();

        const response = await login.loginUser({ ...payload, email: ' ' });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Email' deve ser um email válido");

    });

    test('Não deve logar sem email', async () => {

        const payload = getLoginUser();

        const response = await login.loginUser({ ...payload, email: null });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Email' é obrigatório");

    });

    test('Não deve logar sem senha', async () => {

        const payload = getLoginUser();

        const response = await login.loginUser({ ...payload, password: null });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Password' é obrigatório");

    });

    test('Não deve logar com senha inválida', async () => {

        const payload = getLoginUser();

        const response = await login.loginUser({ ...payload, password: 'invalidPassword' });

        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe('Unauthorized');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Credenciais inválidas');

    });

    test('Não deve logar com senha em branco', async () => {

        const payload = getLoginUser();

        const response = await login.loginUser({ ...payload, password: ' ' });

        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe('Unauthorized');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Credenciais inválidas');

    });

});