// Hiển thị modal sản phẩm và thêm vào giỏ hàng
function showProductModal(item) {
    const modalBg = document.getElementById('productModalBg');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalAddToCart = document.getElementById('modalAddToCart');
    let currentProduct = item;
    modalImg.src = item.querySelector('.product-img').src;
    modalImg.alt = item.querySelector('.product-img').alt;
    modalTitle.textContent = item.querySelector('.product-title').textContent;
    modalDesc.textContent = item.querySelector('.product-desc') ? item.querySelector('.product-desc').textContent : '';
    modalPrice.textContent = item.querySelector('.product-price') ? item.querySelector('.product-price').textContent : '';
    modalBg.style.display = 'flex';
    // Xử lý nút thêm vào giỏ hàng
    modalAddToCart.onclick = function () {
        const name = item.querySelector('.product-title').textContent;
        const priceText = item.querySelector('.product-price') ? item.querySelector('.product-price').textContent.replace(/[^\d]/g, '') : '0';
        const price = parseInt(priceText);
        if (typeof addToCart === 'function') {
            addToCart({ name, price });
            modalAddToCart.textContent = '追加した';
            setTimeout(function () {
                modalAddToCart.textContent = 'カートに追加';
            }, 1200);
        }
    };
}

// Modal sản phẩm
document.addEventListener('DOMContentLoaded', function () {
    const productBtns = document.querySelectorAll('.product-btn');
    const modalBg = document.getElementById('productModalBg');
    const closeModal = document.getElementById('closeProductModal');
    productBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const item = btn.closest('.category-item');
            showProductModal(item);
        });
    });
    if (closeModal) closeModal.onclick = function () {
        modalBg.style.display = 'none';
    };
    if (modalBg) modalBg.onclick = function (e) {
        if (e.target === modalBg) modalBg.style.display = 'none';
    };
});
