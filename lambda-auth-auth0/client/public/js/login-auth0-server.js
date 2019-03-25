(() => {
    document.getElementById('loginAuth0_Server').addEventListener('click', () => {
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
            }),
        })
            .then(res => res.json())
            .then(({ auth, token }) => {
                if (auth) {
                    // save our JWT access token
                    AuthApp.setAuthToken(token);
                }
            });

    });
})();
