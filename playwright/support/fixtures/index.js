import { test as baseTest } from '@playwright/test';
import { linkService } from '../services/links';
import { authService } from '../services/auth';

const test = baseTest.extend({

    auth: async ({ request }, use) => {
        const auth = authService(request);
        await use(auth);
    },

    links: async ({ request }, use) => {
        const links = linkService(request);
        await use(links);
    }
});

export { test };