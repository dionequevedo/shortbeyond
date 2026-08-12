export const getLoginUser = () => {

    const mail = process.env.USER_LOGIN;
    const pass = process.env.PASSWORD_LOGIN;

    return {
        email: mail,
        password: pass
    };
}