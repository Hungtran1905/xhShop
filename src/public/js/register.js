
const registerForm = document.getElementById("registerForm");
const toast = document.getElementById("toast");

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const gender = document.getElementById("gender").value;

    // simple validation
    let ok = true;
    if (!fullName) { document.getElementById("nameError").style.display = 'block'; ok = false; } else { document.getElementById("nameError").style.display = 'none'; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { document.getElementById("emailError").style.display = 'block'; ok = false; } else { document.getElementById("emailError").style.display = 'none'; }
    if (password.length < 6) { document.getElementById("passError").style.display = 'block'; ok = false; } else { document.getElementById("passError").style.display = 'none'; }
    if (password !== confirmPassword) { document.getElementById("confirmError").style.display = 'block'; ok = false; } else { document.getElementById("confirmError").style.display = 'none'; }
    if (!gender) { document.getElementById("genderError").style.display = 'block'; ok = false; } else { document.getElementById("genderError").style.display = 'none'; }

    if (!ok) return;

    const payload = { fullName, email, password, gender, currentUrl: window.location.href };

    try {
        const res = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (!res.ok) {
            showToast(result.message);
        } else {
            showToast(result.message);
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 1200);
        }

    } catch (err) {
        showToast("エラーが発生しました。もう一度お試しください。");
        console.error(err);
    }
});
