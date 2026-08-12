import { test } from '@playwright/test';
import { expect } from '../../support/matchers/ulidMatcher'; // Importa o expect estendido
import { getUser } from '../../support/factories/userBR';
import { authService } from '../../support/services/auth';

test.describe('POST /api/auth/register', () => {

    let register;

    test.beforeEach(({ request }) => {

        register = authService(request);

    });

    test('Deve cadastrar um novo usuário', async () => {
        const payload = getUser();

        const response = await register.creatUser(payload);

        expect(response.status()).toBe(201);
        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Usuário cadastrado com sucesso!');
        expect(responseBody).toHaveProperty('user');
        expect(responseBody.user).toHaveProperty('id');
        expect(responseBody.user.id).toBeULID();
        expect(responseBody.user).toHaveProperty('name', payload.name);
        expect(responseBody.user).toHaveProperty('email', payload.email);

    });

    test('Não deve cadastrar usuário já existente', async () => {
        const payload = getUser();
        const preCondition = await register.creatUser(payload);
        expect(preCondition.status()).toBe(201);

        const response = await register.creatUser(payload);

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.');

    });

    test('Não deve cadastrar email inválido', async () => {
        const payload = getUser();

        const response = await register.creatUser({ ...payload, email: 'invalidEmail@invalid' });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Email' deve ser um email válido");

    });

    test('Não deve cadastrar senha inválida', async () => {
        const payload = getUser();

        const response = await register.creatUser({ ...payload, password: 'a1' });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Password' deve ter no mínimo 6 caracteres");

    });

    test('Não deve cadastrar usuário sem senha', async () => {
        const payload = getUser();

        const response = await register.creatUser({ ...payload, password: null });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Password' é obrigatório");

    });

    test('Não deve cadastrar nome inválido', async () => {
        const payload = getUser();

        const response = await register.creatUser({ ...payload, name: ' ' });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Name' deve ter no mínimo 2 caracteres");

    });

    test('Não deve cadastrar sem nome', async () => {
        const payload = getUser();

        const response = await register.creatUser({ ...payload, name: null });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe('Bad Request');
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Name' é obrigatório");

    });

});
