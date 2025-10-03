let swiper = new Swiper(".swiper", {
    slidesPerView: 4,      // hiển thị 3 slide cùng lúc
    spaceBetween: 30,      // khoảng cách giữa các slide
    grabCursor: true,
    speed: 2000,
    loop: true,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    // Bỏ effect: "fade" để hiển thị nhiều slide
});



