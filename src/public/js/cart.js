// --- GIỎ HÀNG ---
function getCart() {
    let cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartCount() {
    var cart = getCart();
    var cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = cart.length;
}


function showCartModal() {
    var cartModalBg = document.getElementById('cartModalBg');
    var cartItemsDiv = document.getElementById('cartItems');
    var cartTotalDiv = document.getElementById('cartTotal');
    var cart = getCart();
    cartModalBg.classList.add('active');
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `<p>カートは空です!</p>`;
        cartTotalDiv.textContent = '';
        return;
    }
    var total = 0;
    cartItemsDiv.innerHTML = cart.map((item, idx) => {
        total += item.price * item.quantity;
        return `<div style='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;'>
        <span>${item.name} (${item.size || ''}) x${item.quantity} 
        <span style='color:var(--primary-color);'>${(item.price * item.quantity).toLocaleString()}¥</span></span>
        <button class="remove-item-btn-cart" onclick='removeFromCart("${item.productId}", "${item.size}")' style='background:var(--primary-color);color:#fff;border:none;border-radius:8px;padding:4px 10px;cursor:pointer;'>
消去</button>
    </div>`;
    }).join('');
    cartTotalDiv.textContent = '合計: ' + total.toLocaleString() + '¥';
}

function closeCartModal() {
    var cartModalBg = document.getElementById('cartModalBg');
    cartModalBg.classList.remove('active');
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}
function showCartWarning() {
    var cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = `<p id="cartWarning" style="color:#e91e63;font-size:1.1rem;font-weight:bold;text-align:center;animation:shake 0.5s;">カート空✖!</p>`;
    var cartTotalDiv = document.getElementById('cartTotal');
    if (cartTotalDiv) cartTotalDiv.textContent = '';
}


async function addToCart(product) {
    var cart = getCart();
    var data = {
        productId: product.id,
        name: product.name,
        size: product.size,
        price: product.price,
        quantity: product.quantity || 1,
        images: product.image || []
    };
    const res = await fetch("/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    console.log(data)
    const result = await res.json();
    console.log("Kết quả thêm:", result);
    // tìm xem sản phẩm đã có chưa (theo id + size)
    var idx = cart.findIndex(item => item.id === product.id && item.size === product.size);
    if (idx > -1) {
        // nếu đã có => cộng dồn số lượng
        cart[idx].quantity += product.quantity;
    } else {
        // nếu chưa có => thêm mới
        cart.push(product);
    }
    saveCart(cart);
    updateCartCount();

}
async function removeFromCart(productId, size) {
    try {
        const res = await fetch("/cart/remove",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, size })
            });
        const result = await res.json();
        if (result.success) {
            console.log("Kết quả xóa:", result);
            // Lấy dữ liệu cart mới từ localStorage
            localStorage.setItem('cart', JSON.stringify(result.cart.items));
            updateCartCount();
            showCartModal();
        } else {
            alert("Lỗi xóa sản phẩm: " + result.message);
        }
    } catch (err) {
        console.error("Fetch lỗi:", err);
    }
}



async function loadCartFromServer() {
    try {
        const res = await fetch("/cart"); // route trả về giỏ hàng của user
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('cart', JSON.stringify(data.cart.items));
            updateCartCount();
        }
    } catch (err) {
        console.error("Không tải được giỏ hàng:", err);
    }
}
console.log("check items", data.cart.items);
window.addEventListener('DOMContentLoaded', loadCartFromServer);
// Hiệu ứng shake
var style = document.createElement('style');
style.innerHTML = `@keyframes shake { 0% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-8px); } 80% { transform: translateX(8px); } 100% { transform: translateX(0); } }`;
document.head.appendChild(style);


window.addEventListener('DOMContentLoaded', function () {
    // //báo lỗi khi giỏ hàng trống mà nhấn nút tính tiền
    var checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = async function (event) {
            var cart = getCart();
            if (!cart || cart.length === 0) {
                showCartWarning();
                event.preventDefault();
                return;
            }
            event.preventDefault();
        };
    }

    updateCartCount();
    var cartBtn = document.getElementById('cartBtn');
    var closeCart = document.getElementById('closeCart');
    var cartModalBg = document.getElementById('cartModalBg');
    if (cartBtn && cartModalBg) {
        cartBtn.onclick = function () {
            cartModalBg.style.display = 'flex';
            showCartModal();
        };
    }
    if (closeCart && cartModalBg) {
        closeCart.onclick = function () {
            cartModalBg.style.display = 'none';
        };
    }
    if (cartModalBg) {
        cartModalBg.onclick = function (e) {
            if (e.target === cartModalBg) cartModalBg.style.display = 'none';
        };
    }
    // Thêm sự kiện cho nút "Thêm vào giỏ"
    var productBtns = document.querySelectorAll('.product-item .btn');
    productBtns.forEach(function (btn) {
        btn.onclick = async function () {
            var productItem = btn.closest('.product-item');
            var name = productItem.querySelector('h3').textContent;
            var priceText = productItem.querySelector('.price').textContent.replace(/[^\d]/g, '');
            var price = parseInt(priceText);
            const product = {
                productId: modalBg.dataset.id,
                name: modalBg.dataset.name,
                size: selectedSize,
                price: modalBg.dataset.price,
                quantity: parseInt(quantityInput.value),
                images: imagesArray
            };


            try {
                const res = await fetch("/cart/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(product)
                });

                await res.json();
                console.log("check day:", product)
            } catch (err) {
                alert("エラーが発生しました。もう一度試してください。");
            }
            addToCart({ name, price });
            btn.textContent = '追加した!';
            setTimeout(function () {
                btn.textContent = 'カートに追加';
            }, 1200);
        };
    });
});