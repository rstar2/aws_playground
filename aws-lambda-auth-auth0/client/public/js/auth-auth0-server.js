(() => {
    document.getElementById('authAuth0_Server').addEventListener('click', () => {
        fetch('/auth/auth')
            .then(res => res.json())
            .then(({ auth, token }) => {
                if (auth) {
                    // save our JWT access token
                    AuthApp.setAuthToken(token);
                }
            });

    });
})();
