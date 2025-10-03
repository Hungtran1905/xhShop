const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // ngăn reload trang

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    data.currentUrl = window.location.href; // gửi URL hiện tại


    try {
        const res = await fetch("auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            // Hiện toast khi có lỗi
            showToast(result.message);
        } else {
            // Login thành công → redirect
            window.location.href = result.redirectTo || "/";
        }

    } catch (err) {
        showToast("サーバーエラーが発生しました");
        console.error(err);
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // ngăn reload trang

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());
    data.currentUrl = window.location.href; // gửi URL hiện tại

    try {
        const res = await fetch("auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            showToast(result.message);
        } else {
            showToast(result.message); // có thể hiển thị toast thành công
            setTimeout(() => {
                window.location.href = result.redirectTo;
            }, 1000);
        }

    } catch (err) {
        showToast("サーバーエラーが発生しました");
        console.error(err);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return; // nếu không có nút logout, bỏ qua

    logoutBtn.addEventListener("click", async () => {

        try {
            const res = await fetch("/auth/logout", { // thêm / để path tuyệt đối
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentUrl: window.location.href })
            });

            let result;
            try {
                result = await res.json();
            } catch {
                showToast("サーバーエラーが発生しました");
                return;
            }

            if (!res.ok) {
                showToast(result.message || "ログアウトに失敗しました");
            } else {
                window.location.href = result.redirectTo || "/login";
            }
        } catch (err) {
            showToast("サーバーエラーが発生しました");
            console.error(err);
        }
    });
});


function showToast(message, duration = 1000) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("opacity-0", "translate-x-full");
    toast.classList.add("opacity-100", "translate-x-0");

    setTimeout(() => {
        toast.classList.remove("opacity-100", "translate-x-0");
        toast.classList.add("opacity-0", "translate-x-full");
    }, duration);
}

