const AuthApp = {
    _authToken: null,

    setAuthToken(token) {
        this._authToken = token;
        alert('Logged in');
    },

    getAuthToken() {
        return this._authToken;
    }
};

(() => {
    document.getElementById('loginServer').addEventListener('click', () => {
        fetch('/auth/login-auth0', {
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
                    AuthApp.setAuthToken(token);
                }
            });

    });
})();
