import { expect as baseExpect } from '@playwright/test';

// Regex para estrutura JWT (3 blocos em Base64Url)
const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

// Regex para Crockford's Base32 de 26 caracteres (ULID)
const ULID_REGEX = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i;

// Regex para UUID de 36 caracteres (ex: 123e4567-e89b-12d3-a456-426614174000)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function decodePayload(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export const expect = baseExpect.extend({
    toBeJWT(received, expectedPayload) {
        const isFormatValid = typeof received === 'string' && JWT_REGEX.test(received);

        if (!isFormatValid) {
            return {
                pass: false,
                message: () => `Esperava que "${received}" fosse um JWT válido (3 partes separadas por ponto em Base64Url).`,
            };
        }

        if (!expectedPayload) {
            return {
                pass: true,
                message: () => `Esperava que "${received}" NÃO fosse um JWT válido, mas ele corresponde ao formato.`,
            };
        }

        const payload = decodePayload(received);
        if (!payload) {
            return {
                pass: false,
                message: () => `O token possui o formato visual de JWT, mas a parte do Payload falhou ao ser decodificada em JSON.`,
            };
        }

        for (const key of Object.keys(expectedPayload)) {
            const expectedValue = expectedPayload[key];
            const actualValue = payload[key];

            if (expectedValue instanceof RegExp) {
                if (!expectedValue.test(actualValue)) {
                    return {
                        pass: false,
                        message: () =>
                            `JWT válido, mas a propriedade "${key}" ('${actualValue}') não correspondeu à Regex esperada: ${expectedValue}`,
                    };
                }
            } else if (actualValue !== expectedValue) {
                return {
                    pass: false,
                    message: () =>
                        `JWT válido, mas a propriedade "${key}" no payload esperava '${expectedValue}', recebido: '${actualValue}'`,
                };
            }
        }

        return {
            pass: true,
            message: () => `Esperava que o JWT NÃO contivesse o payload esperado ${JSON.stringify(expectedPayload)}.`,
        };
    },

    toBeULID(received) {
        const pass = typeof received === 'string' && ULID_REGEX.test(received);

        const message = () =>
            pass
                ? `Esperava que "${received}" NÃO fosse um ULID válido, mas ele atende ao formato.`
                : `Esperava que "${received}" fosse um ULID válido (26 caracteres Base32), mas falhou na validação.`;

        return {
            message,
            pass,
        };
    },

    toBeUUID(received) {
        const pass = typeof received === 'string' && UUID_REGEX.test(received);

        const message = () =>
            pass
                ? `Esperava que "${received}" NÃO fosse um UUID válido, mas ele atende ao formato.`
                : `Esperava que "${received}" fosse um UUID válido (formato 8-4-4-4-12), mas falhou na validação.`;

        return {
            message,
            pass,
        };
    },
});
