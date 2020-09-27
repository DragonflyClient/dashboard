const params = new URLSearchParams(window.location.search);
function afterLogin(success, user) {
    localStorage.setItem('user', user);
    console.log(localStorage);
    setTimeout(() => {
        const redirect = params.get('ref') || 'https://dashboard.playdragonfly.net';
        window.location.href = redirect;
    }, 1500);
}