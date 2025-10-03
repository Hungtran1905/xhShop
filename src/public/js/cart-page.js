
// Lấy tất cả nút xóa
const removeButtons = document.querySelectorAll(".remove-item-btn");
const removeSelectedBtn = document.getElementById("removeSelected");
const checkboxes = document.querySelectorAll(".item-check");
const totalEl = document.querySelector("#cartTotal p:last-child"); // chỗ hiển thị tổng tiền
const checkAll = document.getElementById("checkAll");

removeButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        // this là chính cái nút được click
        // closest(".item-container") tìm tới phần tử cha có class "item-container"
        const product = this.closest(".item-container");
        product.remove(); // Xóa sản phẩm khỏi DOM
    });
});




function updateTotal() {
    let total = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) {
            // tìm giá trong phần tử cha
            const product = cb.closest(".item-container");
            const priceText = product.querySelector(".cartTotal").innerText.replace("¥", "").replace(/,/g, "");
            total += parseInt(priceText);
        }
    });
    totalEl.textContent = total.toLocaleString() + "¥";
}

// Lắng nghe sự kiện thay đổi của checkbox
checkboxes.forEach(cb => {
    cb.addEventListener("change", updateTotal);
});

// Nếu muốn load trang mặc định chưa chọn gì → tổng = 0
updateTotal();

// ✅ Chọn / bỏ chọn tất cả
checkAll.addEventListener("change", function () {
    checkboxes.forEach(cb => {
        cb.checked = this.checked;
    });
    updateTotal();
});
// ✅ Xóa nhiều sản phẩm đã chọn

removeSelectedBtn.addEventListener("click", async function () {
    // Lấy danh sách sản phẩm được check
    const checkedProducts = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            const product = cb.closest(".item-container");
            const productId = product.querySelector(".remove-item-btn")
                .getAttribute("onclick")
                .match(/"([^"]+)"/)[1]; // lấy productId từ onclick
            const size = product.querySelector(".remove-item-btn")
                .getAttribute("onclick")
                .match(/"([^"]+)"\s*,\s*"([^"]+)"/)[2]; // lấy size
            checkedProducts.push({ productId, size });
        }
    });

    if (checkedProducts.length === 0) {
        alert("消去する商品を選択してください！");
        return;
    }

    // Gửi API xoá nhiều sản phẩm
    try {
        const res = await fetch("/cart/remove-multiple", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: checkedProducts })
        });
        const data = await res.json();

        if (data.success) {
            // Xoá khỏi DOM
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    cb.closest(".item-container").remove();
                }
            });
            updateTotal();
        } else {
            alert("Lỗi khi xóa sản phẩm!");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Không thể kết nối server!");
    }
});


// Lắng nghe nút checkout
document.getElementById('checkout-Btn').addEventListener('click', async function () {
    const checkedProducts = [];
    document.querySelectorAll(".item-check").forEach(cb => {
        if (cb.checked) {
            const product = cb.closest(".item-container");
            const productId = product.querySelector(".remove-item-btn")
                .getAttribute("onclick")
                .match(/"([^"]+)"/)[1];
            const size = product.querySelector(".remove-item-btn")
                .getAttribute("onclick")
                .match(/"([^"]+)"\s*,\s*"([^"]+)"/)[2];
            const quantity = parseInt(product.querySelector(".qtt").innerText);
            const priceText = product.querySelector(".cartTotal").innerText.replace("¥", "").replace(/,/g, "");
            const price = parseInt(priceText) / quantity;
            const image = product.querySelector("img").getAttribute("src");
            const name = product.querySelector(".item-name").innerText;
            checkedProducts.push({ productId, size, quantity, price, image, name });
        }
    });

    if (checkedProducts.length === 0) {
        alert("チェックアウトする商品を選択してください！");
        return;
    }

    // Chuyển hướng sang trang shipping kèm sản phẩm được chọn
    localStorage.setItem("checkoutItems", JSON.stringify(checkedProducts));
    window.location.href = "/shipping";
});
