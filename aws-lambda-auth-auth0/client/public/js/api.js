/* globals AuthApp */

document.getElementById('api').addEventListener('click', () => {
    fetch(process.env.API_AUTHORIZED_URL + '/test', {
        headers: (() => {
            const authToken = AuthApp.getAuthToken();
            return authToken ? {
                'Authorization': 'Bearer ' + authToken,
            } : {};
        })(),
    })
        .then(res => res.json())
        .then(() => {
            alert('Success');
        })
        .catch(error => {
            console.error(error);
            alert('Failure: ' + error);
        });
});
