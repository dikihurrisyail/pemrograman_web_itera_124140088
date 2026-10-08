const STORAGE_KEY = "miniPOS_cart";

let cart = loadCart();

let promoApplied = false;


// ================================
// ELEMENT HTML
// ================================

const productForm = document.getElementById("productForm");

const productName = document.getElementById("productName");

const productPrice = document.getElementById("productPrice");

const productQty = document.getElementById("productQty");

const paymentInput = document.getElementById("paymentInput");

const promoInput = document.getElementById("promoInput");

const promoBtn = document.getElementById("promoBtn");

const promoMessage = document.getElementById("promoMessage");

const cartBody = document.getElementById("cartBody");

const itemCount = document.getElementById("itemCount");

const totalDisplay = document.getElementById("totalDisplay");

const discountDisplay = document.getElementById("discountDisplay");

const finalDisplay = document.getElementById("finalDisplay");

const paymentMessage = document.getElementById("paymentMessage");

const resetBtn = document.getElementById("resetBtn");


// ================================
// FORMAT RUPIAH
// ================================

function formatRupiah(value) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);

}


// ================================
// LOAD LOCAL STORAGE
// ================================

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(STORAGE_KEY);

        return savedCart
            ? JSON.parse(savedCart)
            : [];

    } catch (error) {

        console.error(
            "Gagal membaca localStorage:",
            error
        );

        return [];

    }

}


// ================================
// SAVE LOCAL STORAGE
// ================================

function saveCart() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
    );

}


// ================================
// ERROR VALIDATION
// ================================

function setError(
    input,
    errorId,
    message
) {

    const errorElement =
        document.getElementById(errorId);

    errorElement.textContent = message;

    input.classList.toggle(
        "input-error",
        Boolean(message)
    );

}


function clearErrors() {

    setError(
        productName,
        "nameError",
        ""
    );

    setError(
        productPrice,
        "priceError",
        ""
    );

    setError(
        productQty,
        "qtyError",
        ""
    );

}


// ================================
// VALIDASI FORM
// ================================

function validateForm() {

    clearErrors();

    const name =
        productName.value.trim();

    const price =
        Number(productPrice.value);

    const qty =
        Number(productQty.value);

    let valid = true;


    // Validasi nama

    if (!name) {

        setError(
            productName,
            "nameError",
            "Nama barang wajib diisi."
        );

        valid = false;

    }

    else if (name.length < 3) {

        setError(
            productName,
            "nameError",
            "Nama barang minimal 3 karakter."
        );

        valid = false;

    }


    // Validasi harga

    if (!productPrice.value.trim()) {

        setError(
            productPrice,
            "priceError",
            "Harga satuan wajib diisi."
        );

        valid = false;

    }

    else if (
        !Number.isFinite(price) ||
        price < 500
    ) {

        setError(
            productPrice,
            "priceError",
            "Harga harus minimal Rp500."
        );

        valid = false;

    }


    // Validasi qty

    if (!productQty.value.trim()) {

        setError(
            productQty,
            "qtyError",
            "Jumlah / Qty wajib diisi."
        );

        valid = false;

    }

    else if (
        !Number.isInteger(qty) ||
        qty < 1
    ) {

        setError(
            productQty,
            "qtyError",
            "Qty harus berupa angka bulat minimal 1."
        );

        valid = false;

    }


    return valid;

}


// ================================
// TAMBAH BARANG
// ================================

function addItem(event) {

    event.preventDefault();


    if (!validateForm()) {
        return;
    }


    const item = {

        id: Date.now(),

        name:
            productName.value.trim(),

        price:
            Number(productPrice.value),

        qty:
            Number(productQty.value)

    };


    cart.push(item);

    saveCart();

    renderCart();


    // Reset form

    productForm.reset();

    clearErrors();

    productName.focus();

}


// ================================
// HAPUS BARANG
// ================================

function deleteItem(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    saveCart();

    renderCart();

}


// ================================
// HITUNG TOTAL
// ================================

function calculateSummary() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.qty,
            0
        );


    /*
        Diskon diberikan jika:

        1. Total belanja >= Rp50.000
           ATAU
        2. Kode promo HEMATBGT digunakan
    */

    const eligibleByTotal =
        total >= 50000;


    const discount =
        (
            eligibleByTotal ||
            promoApplied
        )
            ? total * 0.10
            : 0;


    const finalTotal =
        total - discount;


    return {
        total,
        discount,
        finalTotal
    };

}


// ================================
// RENDER KERANJANG
// ================================

function renderCart() {

    if (cart.length === 0) {

        cartBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Keranjang masih kosong.
                </td>
            </tr>
        `;

    }

    else {

        cartBody.innerHTML =
            cart.map(
                (item, index) => {

                    const subtotal =
                        item.price * item.qty;


                    return `
                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${escapeHtml(item.name)}
                            </td>

                            <td>
                                ${formatRupiah(item.price)}
                            </td>

                            <td>
                                ${item.qty}
                            </td>

                            <td>
                                ${formatRupiah(subtotal)}
                            </td>

                            <td>

                                <button
                                    class="btn btn-delete"
                                    type="button"
                                    onclick="deleteItem(${item.id})"
                                >
                                    Hapus
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");

    }


    // Jumlah item

    const totalQty =
        cart.reduce(
            (sum, item) =>
                sum + item.qty,
            0
        );


    itemCount.textContent =
        `${totalQty} item`;


    // Ringkasan

    const {
        total,
        discount,
        finalTotal
    } = calculateSummary();


    totalDisplay.textContent =
        formatRupiah(total);


    discountDisplay.textContent =
        formatRupiah(discount);


    finalDisplay.textContent =
        formatRupiah(finalTotal);


    updatePayment(finalTotal);

}


// ================================
// HITUNG PEMBAYARAN
// ================================

function updatePayment(
    finalTotal =
        calculateSummary().finalTotal
) {

    const payment =
        Number(paymentInput.value);


    if (!paymentInput.value.trim()) {

        paymentMessage.className =
            "payment-message neutral";

        paymentMessage.textContent =
            "Masukkan uang bayar untuk melihat kembalian.";

        return;

    }


    if (payment < finalTotal) {

        const shortage =
            finalTotal - payment;


        paymentMessage.className =
            "payment-message warning";


        paymentMessage.textContent =
            `Uang belum mencukupi. Kurang ${formatRupiah(shortage)}.`;

    }

    else {

        const change =
            payment - finalTotal;


        paymentMessage.className =
            "payment-message success";


        paymentMessage.textContent =
            `Kembalian: ${formatRupiah(change)}.`;

    }

}


// ================================
// KODE PROMO
// ================================

function applyPromo() {

    const code =
        promoInput.value
            .trim()
            .toUpperCase();


    if (code === "HEMATBGT") {

        promoApplied = true;


        promoMessage.textContent =
            "Kode HEMATBGT berhasil digunakan. Diskon 10% aktif.";


        promoMessage.className =
            "promo-message success";

    }

    else {

        promoApplied = false;


        if (code) {

            promoMessage.textContent =
                "Kode promo tidak valid. Gunakan HEMATBGT.";

        }

        else {

            promoMessage.textContent =
                "Masukkan kode promo terlebih dahulu.";

        }


        promoMessage.className =
            "promo-message error";

    }


    renderCart();

}


// ================================
// TRANSAKSI BARU
// ================================

function resetTransaction() {

    if (
        cart.length === 0 &&
        !paymentInput.value &&
        !promoInput.value
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Yakin ingin mengosongkan transaksi saat ini?"
        );


    if (!confirmed) {
        return;
    }


    cart = [];


    localStorage.removeItem(
        STORAGE_KEY
    );


    paymentInput.value = "";

    promoInput.value = "";

    promoApplied = false;


    promoMessage.textContent = "";

    promoMessage.className =
        "promo-message";


    productForm.reset();

    clearErrors();

    renderCart();

}


// ================================
// CEGAH HTML INJECTION
// ================================

function escapeHtml(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


// ================================
// EVENT LISTENER
// ================================

productForm.addEventListener(
    "submit",
    addItem
);


paymentInput.addEventListener(
    "input",
    () => updatePayment()
);


promoBtn.addEventListener(
    "click",
    applyPromo
);


resetBtn.addEventListener(
    "click",
    resetTransaction
);


// ================================
// TAMPILKAN DATA AWAL
// ================================

renderCart();
