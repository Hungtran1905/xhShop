document.getElementById('shippingForm').onsubmit = async function (e) {
    e.preventDefault();

    const shippingData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        note: document.getElementById('note').value.trim()
    };

    const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];

    try {
        const res = await fetch("/cart/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shippingInfo: shippingData, items: checkoutItems })
        });
        const data = await res.json();

        if (data.success) {
            alert("注文完了！注文コード：" + data.orderId);
            localStorage.removeItem("checkoutItems");
            window.location.href = "/";
        } else {
            alert("エラー: " + data.message);
        }
    } catch (err) {
        alert("サーバーに接続できません!");
        console.error(err);
    }
};