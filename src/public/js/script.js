function showAuthModal() {
    document.getElementById('authModalBg').classList.add('active');
    showLogin();
}
function closeAuthModal() {
    document.getElementById('authModalBg').classList.remove('active');
}
function showLogin() {
    document.getElementById('loginModal').style.display = '';
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}
function showRegister() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('registerModal').style.display = '';
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

// Gán sự kiện sau khi DOM đã sẵn sàng
window.addEventListener('DOMContentLoaded', function () {
    var loginBtn = document.getElementById('loginBtn');
    var closeAuth = document.getElementById('closeAuth');
    var toRegister = document.querySelector('#loginModal .switch-link');
    var toLogin = document.querySelector('#registerModal .switch-link');

    if (loginBtn) {
        loginBtn.onclick = function () {
            showAuthModal();
            showLogin();
        };
    }
    var registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.onclick = function () {
            showAuthModal();
            showRegister();
        };
    }
    if (closeAuth) closeAuth.onclick = closeAuthModal;
    if (toRegister) toRegister.onclick = function () {
        showAuthModal();
        showRegister();
    };
    if (toLogin) toLogin.onclick = function () {
        showAuthModal();
        showLogin();
    };
});




