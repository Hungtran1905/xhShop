
// Small client-side validation + interactivity
const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passError');
const togglePass = document.getElementById('togglePass');

togglePass.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text'; togglePass.textContent = 'Hidden';
    } else { password.type = 'password'; togglePass.textContent = 'Show'; }
});

function validate() {
    let ok = true;
    // basic email check
    const emailVal = email.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(emailVal)) {
        email.classList.add('error'); emailError.style.display = 'block'; ok = false;
    } else { email.classList.remove('error'); emailError.style.display = 'none'; }

    const passVal = password.value || '';
    if (passVal.length < 6) { password.classList.add('error'); passError.style.display = 'block'; ok = false; }
    else { password.classList.remove('error'); passError.style.display = 'none'; }

    return ok;
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // demo: show loading state
    const btn = e.submitter || e.target.querySelector('button[type="submit"]');
    const old = btn.innerHTML; btn.disabled = true; btn.innerHTML = '処理...';

    // TODO: replace with your real endpoint
    try {
        // Example fetch - replace URL and handle response accordingly
        const payload = { email: email.value.trim(), password: password.value, currentUrl: window.location.href };
        const res = await fetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        // On success: redirect
        window.location.href = data.redirect || '/';
    } catch (err) {
        alert('ログインに失敗しました。情報を確認するか、後でもう一度お試しください。');
        console.error(err);
    } finally { btn.disabled = false; btn.innerHTML = old; }
});

function onSocial(provider) {
    // Replace with your OAuth endpoints
    alert('OAuth: mở ' + provider + ' (thay bằng endpoint thực tế), cái này cũng chưa làm hehee');
}
function onGuest() {
    // small demo action
    alert('Vào chế độ khách — chưa làm hehee');
}

const forgotModal = document.getElementById('forgotModal');
const forgotEmail = document.getElementById('forgotEmail');
const forgotError = document.getElementById('forgotError');
const forgotSubmit = document.getElementById('forgotSubmit');
const forgotClose = document.getElementById('forgotClose');

// Mở modal khi click link "Quên mật khẩu?"
document.getElementById('forgotLink').addEventListener('click', (e) => {
    e.preventDefault();
    forgotModal.style.display = 'flex';
});

// Đóng modal
forgotClose.addEventListener('click', () => {
    forgotModal.style.display = 'none';
});

// Submit email quên mật khẩu
forgotSubmit.addEventListener('click', async () => {
    const emailVal = forgotEmail.value.trim();

    if (!/^\S+@\S+\.\S+$/.test(emailVal)) {
        forgotError.style.display = 'block';
        return;
    } else {
        forgotError.style.display = 'none';
    }
});
