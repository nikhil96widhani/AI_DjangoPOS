const $btnPrint = document.querySelector("#btnPrint");
$btnPrint.addEventListener("click", () => {
    window.print();
    window.open('', '_parent', '');
    window.close()
});