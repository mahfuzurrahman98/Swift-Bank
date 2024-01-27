const useLogin = () => {
    const login = async () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${
            import.meta.env.VITE_GOOGLE_CLIENT_ID
        }&redirect_uri=${
            import.meta.env.VITE_GOOGLE_REDIRECT_URI
        }&response_type=code&scope=openid%20profile%20email`;
        console.log(googleAuthUrl);
        window.location.href = googleAuthUrl;
    };

    return login;
};

export default useLogin;
