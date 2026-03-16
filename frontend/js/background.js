const symbols = document.querySelectorAll(".math-symbol");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    symbols.forEach((symbol, index) => {
        const speed = (index + 1) * 0.1;
        symbol.style.transform = `translateY(${scrollY * speed * 0.05}px)`;
    });
});
