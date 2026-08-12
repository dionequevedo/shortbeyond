export const authService = (request) => {

    const loginUser = async (payload) => {
        return await request.post('/api/auth/login', {
            data: payload
        });
    };

    const createUser = async (payload) => {
        return await request.post('/api/auth/register', {
            data: payload
        });
    };

    return {
        loginUser,
        createUser,
        creatUser: createUser // Alias para compatibilidade caso seja chamado com a grafia antiga
    };

}