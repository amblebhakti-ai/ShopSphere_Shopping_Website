// ===============================
// ShopSphere - Cart & Wishlist System
// ===============================


// =====================================================
// CART SYSTEM - FIXED VERSION
// =====================================================

let cart =
    JSON.parse(
        localStorage.getItem("shopSphereCart")
    ) || [];


// =====================================================
// CREATE SAFE CART ID
// =====================================================

function getProductKey(product) {

    return String(
        product.productId ||
        product.id ||
        product.name
    );

}


// =====================================================
// ADD TO CART
// =====================================================

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(".cart-btn");

    if (!button) return;


    // ==========================================
    // PRODUCT DETAILS PAGE
    // ==========================================

    const detailsPage =
        document.querySelector(".product-details");


    if (
        detailsPage &&
        !button.closest(".product-card")
    ) {

        const selectedProduct =
            JSON.parse(
                localStorage.getItem(
                    "shopSphereSelectedProduct"
                )
            );


        const image =
            detailsPage
                .querySelector(".main-image")
                ?.getAttribute("src");


        const name =
            detailsPage
                .querySelector(".product-info h2")
                ?.innerText
                .trim();


        const priceElement =
            detailsPage
                .querySelector(".product-info .price");


        if (
            !image ||
            !name ||
            !priceElement
        ) {

            alert(
                "Product details not found!"
            );

            return;

        }


        const priceMatch =
            priceElement.innerText.match(
                /₹\s*([\d,]+)/
            );


        if (!priceMatch) {

            alert(
                "Product price not found!"
            );

            return;

        }


        const price =
            Number(
                priceMatch[1]
                    .replace(/,/g, "")
            );


        const productId =
            selectedProduct?._id ||
            name;


        addProductToCart({

            id: productId,

            productId: productId,

            name: name,

            image: image,

            price: price,

            quantity: 1

        });


        alert(
            `${name} added to cart 🛒`
        );


        return;

    }



    // ==========================================
    // PRODUCTS PAGE
    // ==========================================

    const card =
        button.closest(".product-card");


    if (!card) return;


    const image =
        card
            .querySelector("img")
            ?.getAttribute("src");


    const name =
        card
            .querySelector("h3")
            ?.innerText
            .trim();


    const priceElement =
        card.querySelector(".offer");


    if (
        !image ||
        !name ||
        !priceElement
    ) {

        return;

    }


    const price =
        Number(
            priceElement.innerText
                .replace(/[₹,]/g, "")
        );


    // MongoDB selected product
    const mongoProduct =
        window.mongoProducts?.find(
            product =>
                product.name === name
        );


    const productId =
        mongoProduct?._id ||
        name;


    addProductToCart({

        id: productId,

        productId: productId,

        name: name,

        image: image,

        price: price,

        quantity: 1

    });


    alert(
        `${name} added to cart 🛒`
    );

});



// =====================================================
// ADD PRODUCT HELPER
// =====================================================

function addProductToCart(product) {

    const productKey =
        String(product.productId);


    const existingProduct =
        cart.find(
            item =>
                String(
                    item.productId ||
                    item.id
                ) === productKey
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push(product);

    }


    saveCart();

}



// =====================================================
// UPDATE CART COUNT
// =====================================================

function updateCartCount() {

    const totalQuantity =
        cart.reduce(
            (total, product) =>
                total +
                Number(product.quantity || 0),
            0
        );


    const cartLinks =
        document.querySelectorAll(
            'a[href="cart.html"]'
        );


    cartLinks.forEach(link => {

        let count =
            link.querySelector(
                ".cart-count"
            );


        if (!count) {

            count =
                document.createElement(
                    "span"
                );

            count.className =
                "cart-count";

            count.style.marginLeft =
                "5px";

            count.style.fontWeight =
                "bold";

            link.appendChild(count);

        }


        count.innerText =
            `(${totalQuantity})`;

    });

}



// =====================================================
// DISPLAY CART
// =====================================================

function displayCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    if (!cartItems) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div style="
                background:#fff;
                padding:40px;
                text-align:center;
                border-radius:12px;
                box-shadow:0 5px 15px rgba(0,0,0,.1);
            ">

                <h2>
                    🛒 Your Cart is Empty
                </h2>

                <p style="margin:15px 0;">
                    Add some products to your cart.
                </p>

                <a
                    href="products.html"
                    class="place-order-btn"
                    style="
                        display:inline-block;
                        padding:12px 25px;
                    "
                >
                    Continue Shopping
                </a>

            </div>

        `;

        updatePriceDetails();

        return;

    }


    cartItems.innerHTML = "";


    cart.forEach(product => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "cart-card";


        const productKey =
            String(
                product.productId ||
                product.id
            );


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >


            <div class="cart-info">

                <h3>
                    ${product.name}
                </h3>


                <p class="rating">
                    ⭐⭐⭐⭐⭐ 4.5
                </p>


                <p class="price">
                    ₹${Number(
                        product.price
                    ).toLocaleString("en-IN")}
                </p>


                <p class="delivery">
                    🚚 Free Delivery
                </p>


                <div class="quantity">

                    <button
                        class="quantity-minus"
                        data-id="${productKey}"
                    >
                        −
                    </button>


                    <input
                        type="text"
                        value="${product.quantity}"
                        readonly
                    >


                    <button
                        class="quantity-plus"
                        data-id="${productKey}"
                    >
                        +
                    </button>

                </div>


                <div class="cart-buttons">

                    <button
                        class="cart-remove"
                        data-id="${productKey}"
                    >
                        ❌ Remove
                    </button>


                    <button
                        class="wishlist-btn"
                        data-id="${productKey}"
                    >
                        ❤️ Move to Wishlist
                    </button>

                </div>

            </div>

        `;


        cartItems.appendChild(
            card
        );

    });


    updatePriceDetails();

}



// =====================================================
// QUANTITY PLUS
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".quantity-plus"
            );


        if (!button) return;


        const id =
            String(
                button.dataset.id
            );


        const product =
            cart.find(
                item =>
                    String(
                        item.productId ||
                        item.id
                    ) === id
            );


        if (product) {

            product.quantity += 1;

            saveCart();

        }

    }
);



// =====================================================
// QUANTITY MINUS
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".quantity-minus"
            );


        if (!button) return;


        const id =
            String(
                button.dataset.id
            );


        const product =
            cart.find(
                item =>
                    String(
                        item.productId ||
                        item.id
                    ) === id
            );


        if (!product) return;


        if (
            Number(product.quantity) > 1
        ) {

            product.quantity -= 1;

        } else {

            cart =
                cart.filter(
                    item =>
                        String(
                            item.productId ||
                            item.id
                        ) !== id
                );

        }


        saveCart();

    }
);



// =====================================================
// REMOVE PRODUCT
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".cart-remove"
            );


        if (!button) return;


        const id =
            String(
                button.dataset.id
            );


        cart =
            cart.filter(
                item =>
                    String(
                        item.productId ||
                        item.id
                    ) !== id
            );


        saveCart();

    }
);



// =====================================================
// SAVE CART
// =====================================================

function saveCart() {

    localStorage.setItem(
        "shopSphereCart",
        JSON.stringify(cart)
    );


    updateCartCount();

    displayCart();

}



// =====================================================
// CART PRICE DETAILS
// =====================================================

function updatePriceDetails() {

    const itemCount =
        cart.reduce(
            (total, product) =>
                total +
                Number(
                    product.quantity || 0
                ),
            0
        );


    const totalPrice =
        cart.reduce(
            (total, product) =>
                total +
                (
                    Number(product.price || 0) *
                    Number(product.quantity || 0)
                ),
            0
        );


    const itemCountElement =
        document.getElementById(
            "cartItemCount"
        );


    const totalPriceElement =
        document.getElementById(
            "cartTotalPrice"
        );


    const finalTotalElement =
        document.getElementById(
            "cartFinalTotal"
        );


    const discountElement =
        document.getElementById(
            "cartDiscount"
        );


    const savingElement =
        document.getElementById(
            "cartSaving"
        );


    if (itemCountElement) {

        itemCountElement.innerText =
            `${itemCount} Items`;

    }


    if (totalPriceElement) {

        totalPriceElement.innerText =
            `₹${totalPrice.toLocaleString("en-IN")}`;

    }


    const discount = 0;


    if (discountElement) {

        discountElement.innerText =
            `− ₹${discount.toLocaleString("en-IN")}`;

    }


    if (finalTotalElement) {

        finalTotalElement.innerText =
            `₹${(
                totalPrice - discount
            ).toLocaleString("en-IN")}`;

    }


    if (savingElement) {

        savingElement.innerText =
            `₹${discount.toLocaleString("en-IN")}`;

    }

}



// =====================================================
// INITIALIZE CART
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        displayCart();

    }
);


// =====================================================
// WISHLIST SYSTEM
// =====================================================

let wishlist =
    JSON.parse(
        localStorage.getItem(
            "shopSphereWishlist"
        )
    ) || [];


// =====================================================
// WISHLIST HEART
// =====================================================

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(
            ".product-card .wishlist"
        );


    if (!button) return;


    const card =
        button.closest(".product-card");


    if (!card) return;


    const image =
        card
            .querySelector("img")
            ?.getAttribute("src");


    const name =
        card
            .querySelector("h3")
            ?.innerText
            .trim();


    const priceElement =
        card.querySelector(".offer");


    if (
        !image ||
        !name ||
        !priceElement
    ) return;


    const priceText =
        priceElement.innerText
            .replace(/[₹,]/g, "");


    const price =
        Number(priceText);


    const existingProduct =
        wishlist.find(
            product =>
                product.name === name
        );


    if (existingProduct) {

        wishlist =
            wishlist.filter(
                product =>
                    product.name !== name
            );


        button.innerText =
            "🤍";


        localStorage.setItem(
            "shopSphereWishlist",
            JSON.stringify(wishlist)
        );


        displayWishlist();

        return;
    }


    wishlist.push({

        id: Date.now(),

        name: name,

        image: image,

        price: price

    });


    localStorage.setItem(
        "shopSphereWishlist",
        JSON.stringify(wishlist)
    );


    button.innerText =
        "❤️";


    displayWishlist();

});


// =====================================================
// DISPLAY WISHLIST
// =====================================================

function displayWishlist() {

    const wishlistItems =
        document.getElementById(
            "wishlistItems"
        );


    if (!wishlistItems) return;


    if (wishlist.length === 0) {

        wishlistItems.innerHTML = `

            <div style="
                background:#fff;
                padding:40px;
                text-align:center;
                border-radius:12px;
                box-shadow:0 5px 15px rgba(0,0,0,.1);
                width:100%;
            ">

                <h2>
                    ❤️ Your Wishlist is Empty
                </h2>


                <p style="margin:15px 0;">

                    Add your favourite
                    products here.

                </p>


                <a
                    href="products.html"
                    class="place-order-btn"
                    style="
                        display:inline-block;
                        padding:12px 25px;
                    ">

                    Continue Shopping

                </a>

            </div>

        `;


        updateWishlistSummary();

        return;
    }


    wishlistItems.innerHTML = "";


    wishlist.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "wishlist-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >


            <div class="wishlist-info">

                <h3>
                    ${product.name}
                </h3>


                <p class="rating">
                    ⭐⭐⭐⭐⭐ 4.5
                </p>


                <p class="price">

                    ₹${product.price.toLocaleString("en-IN")}

                </p>


                <p class="delivery">

                    🚚 Free Delivery

                </p>


                <div class="wishlist-buttons">

                    <button
                        class="wishlist-cart-btn"
                        data-id="${product.id}">

                        🛒 Move to Cart

                    </button>


                    <button
                        class="wishlist-remove-btn"
                        data-id="${product.id}">

                        ❌ Remove

                    </button>

                </div>

            </div>

        `;


        wishlistItems.appendChild(card);

    });


    updateWishlistSummary();

}


// =====================================================
// REMOVE FROM WISHLIST
// =====================================================

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(
            ".wishlist-remove-btn"
        );


    if (!button) return;


    const id =
        Number(button.dataset.id);


    wishlist =
        wishlist.filter(
            product =>
                product.id !== id
        );


    localStorage.setItem(
        "shopSphereWishlist",
        JSON.stringify(wishlist)
    );


    displayWishlist();

    updateWishlistHearts();

});


// =====================================================
// MOVE WISHLIST PRODUCT TO CART
// =====================================================

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(
            ".wishlist-cart-btn"
        );


    if (!button) return;


    const id =
        Number(button.dataset.id);


    const product =
        wishlist.find(
            item => item.id === id
        );


    if (!product) return;


    const existingProduct =
        cart.find(
            item =>
                item.name === product.name
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: Date.now(),

            name: product.name,

            image: product.image,

            price: product.price,

            quantity: 1

        });

    }


    localStorage.setItem(
        "shopSphereCart",
        JSON.stringify(cart)
    );


    wishlist =
        wishlist.filter(
            item =>
                item.id !== id
        );


    localStorage.setItem(
        "shopSphereWishlist",
        JSON.stringify(wishlist)
    );


    updateCartCount();

    displayWishlist();

    updateWishlistHearts();


    alert(
        `${product.name} moved to cart 🛒`
    );

});


// =====================================================
// MOVE ALL WISHLIST PRODUCTS TO CART
// =====================================================

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(
            "#moveAllToCart"
        );


    if (!button) return;


    event.preventDefault();


    if (wishlist.length === 0) {

        alert(
            "Your Wishlist is empty ❤️"
        );

        return;
    }


    wishlist.forEach(product => {

        const existingProduct =
            cart.find(
                item =>
                    item.name === product.name
            );


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                id: Date.now() +
                    Math.random(),

                name: product.name,

                image: product.image,

                price: product.price,

                quantity: 1

            });

        }

    });


    localStorage.setItem(
        "shopSphereCart",
        JSON.stringify(cart)
    );


    wishlist = [];


    localStorage.setItem(
        "shopSphereWishlist",
        JSON.stringify(wishlist)
    );


    updateCartCount();

    displayWishlist();

    updateWishlistHearts();


    alert(
        "All Wishlist products moved to Cart 🛒"
    );

});


// =====================================================
// UPDATE WISHLIST HEARTS
// =====================================================

function updateWishlistHearts() {

    document
        .querySelectorAll(
            ".product-card .wishlist"
        )
        .forEach(button => {

            const card =
                button.closest(
                    ".product-card"
                );


            if (!card) return;


            const name =
                card
                    .querySelector("h3")
                    ?.innerText
                    .trim();


            if (!name) return;


            const isWishlisted =
                wishlist.some(
                    product =>
                        product.name === name
                );


            if (isWishlisted) {

                button.innerText =
                    "❤️";

            } else {

                button.innerText =
                    "🤍";

            }

        });

}


// =====================================================
// WISHLIST SUMMARY
// =====================================================

function updateWishlistSummary() {

    const count =
        wishlist.length;


    const value =
        wishlist.reduce(
            (total, product) =>
                total + product.price,
            0
        );


    const savings = 0;


    const countElement =
        document.getElementById(
            "wishlistCount"
        );


    const valueElement =
        document.getElementById(
            "wishlistValue"
        );


    const savingsElement =
        document.getElementById(
            "wishlistSavings"
        );


    if (countElement) {

        countElement.innerText =
            count;

    }


    if (valueElement) {

        valueElement.innerText =
            `₹${value.toLocaleString("en-IN")}`;

    }


    if (savingsElement) {

        savingsElement.innerText =
            `₹${savings.toLocaleString("en-IN")}`;

    }

}


// =====================================================
// PRODUCT IMAGE GALLERY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const mainImage =
        document.querySelector(".main-image");


    const smallImages =
        document.querySelectorAll(
            ".small-images img"
        );


    if (
        !mainImage ||
        smallImages.length === 0
    ) {
        return;
    }


    smallImages.forEach(function (smallImage) {

        smallImage.addEventListener(
            "click",
            function () {

                mainImage.src =
                    smallImage.src;


                mainImage.alt =
                    smallImage.alt;


                smallImages.forEach(
                    function (img) {

                        img.classList.remove(
                            "active-image"
                        );

                    }
                );


                smallImage.classList.add(
                    "active-image"
                );

            }
        );

    });


    smallImages[0].classList.add(
        "active-image"
    );

});


// =====================================================
// PRODUCT COLOR SELECTION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const mainImage =
        document.querySelector(".main-image");


    const colorOptions =
        document.querySelectorAll(
            ".color-options .color"
        );


    const smallImages =
        document.querySelectorAll(
            ".small-images img"
        );


    if (
        !mainImage ||
        colorOptions.length === 0 ||
        smallImages.length === 0
    ) {
        return;
    }


    colorOptions.forEach(
        function (color, index) {

            color.addEventListener(
                "click",
                function () {

                    const selectedImage =
                        smallImages[index];


                    if (!selectedImage) {
                        return;
                    }


                    mainImage.src =
                        selectedImage.src;


                    mainImage.alt =
                        selectedImage.alt;


                    colorOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected-color"
                            );

                        }
                    );


                    color.classList.add(
                        "selected-color"
                    );

                }
            );

        }
    );


    if (colorOptions[0]) {

        colorOptions[0].classList.add(
            "selected-color"
        );

    }

});


// =====================================================
// BUY NOW - PRODUCT DETAILS PAGE → CHECKOUT
// =====================================================

document.addEventListener("click", function (event) {

    const button = event.target.closest(".buy-btn");

    if (!button) return;


    const detailsPage =
        document.querySelector(".product-details");

    if (!detailsPage) return;


    // Get MongoDB selected product
    const selectedProduct =
        JSON.parse(
            localStorage.getItem(
                "shopSphereSelectedProduct"
            )
        );


    if (
        !selectedProduct ||
        !selectedProduct._id
    ) {

        alert(
            "Product information not found. Please open the product again."
        );

        return;

    }


    const image =
        detailsPage
            .querySelector(".main-image")
            ?.getAttribute("src");


    const name =
        detailsPage
            .querySelector(".product-info h2")
            ?.innerText
            .trim();


    const priceElement =
        detailsPage
            .querySelector(".product-info .price");


    if (
        !image ||
        !name ||
        !priceElement
    ) {

        alert(
            "Product details not found!"
        );

        return;

    }


    const priceMatch =
        priceElement.innerText.match(
            /₹\s*([\d,]+)/
        );


    if (!priceMatch) {

        alert(
            "Product price not found!"
        );

        return;

    }


    const price =
        Number(
            priceMatch[1]
                .replace(/,/g, "")
        );


    // ==========================================
    // CREATE BUY NOW PRODUCT
    // ==========================================

    const buyNowProduct = {

        id: selectedProduct._id,

        productId:
            selectedProduct._id,

        name: name,

        image: image,

        price: price,

        quantity: 1

    };


    localStorage.setItem(
        "shopSphereBuyNow",
        JSON.stringify(
            buyNowProduct
        )
    );


    // ==========================================
    // ADD TO CART
    // ==========================================

    const existingProduct =
        cart.find(
            product =>
                product.productId ===
                selectedProduct._id
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id:
                selectedProduct._id,

            productId:
                selectedProduct._id,

            name: name,

            image: image,

            price: price,

            quantity: 1

        });

    }


    localStorage.setItem(
        "shopSphereCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    // ==========================================
    // GO TO CHECKOUT
    // ==========================================

    window.location.href =
        "checkout.html";

});


// =====================================================
// SIZE SELECTION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const sizes =
        document.querySelectorAll(
            ".size-options button"
        );


    if (sizes.length === 0) return;


    sizes.forEach(function (size) {

        size.addEventListener(
            "click",
            function () {

                sizes.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected-size"
                        );

                    }
                );


                size.classList.add(
                    "selected-size"
                );

            }
        );

    });

});


// =====================================================
// LOAD PRODUCTS FROM MONGODB
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const productContainer =
            document.getElementById(
                "product-container"
            );


        if (!productContainer) return;


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/products"
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch products"
                );

            }


            const products =
                await response.json();


            console.log(
                "Products from MongoDB:",
                products
            );


            productContainer.innerHTML = "";


            window.mongoProducts =
                products;





// =====================================================
// SEARCH FILTER
// =====================================================

const searchParams =
    new URLSearchParams(window.location.search);

const searchText =
    (searchParams.get("search") || "")
        .trim()
        .toLowerCase();

const categoryText =
    (searchParams.get("category") || "")
        .trim()
        .toLowerCase();

let filteredProducts =
    products;


// Search product by name or category
if (searchText) {

    filteredProducts =
        products.filter(function (product) {

            return (
                product.name
                    .toLowerCase()
                    .includes(searchText)
                ||
                product.category
                    .toLowerCase()
                    .includes(searchText)
            );

        });

}



// =====================================================
// CATEGORY FILTER
// =====================================================

if (categoryText) {

    filteredProducts =
        filteredProducts.filter(function (product) {

            return product.category
                .toLowerCase()
                .includes(categoryText);

        });

}


if (
    (searchText || categoryText) &&
    filteredProducts.length === 0
) {

    productContainer.innerHTML = `

        <div style="
            width:100%;
            text-align:center;
            padding:50px;
        ">

            <h2>🔍 No Products Found</h2>

            <p>
                No products found.
            </p>

        </div>

    `;

    return;
}




// Show search text in search box
const searchInput =
    document.getElementById("searchInput");

if (searchInput && searchText) {

    searchInput.value = searchText;

}





            filteredProducts.forEach(
                function (product) {

                    const productCard =
                        document.createElement(
                            "div"
                        );


                    productCard.className =
                        "product-card";


                    productCard.innerHTML = `

                        <span class="wishlist">
                            🤍
                        </span>


                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >


                        <h3>

                            <a
                                href="#"
                                class="product-link"
                            >

                                ${product.name}

                            </a>

                        </h3>


                        <div class="price-box">

                            <span class="mrp">

                                ₹${product.mrp.toLocaleString("en-IN")}

                            </span>


                            <span class="offer">

                                ₹${product.price.toLocaleString("en-IN")}

                            </span>


                            <span class="discount">

                                ${product.discount}

                            </span>

                        </div>


                        <p class="rating">

                            ${product.rating} ⭐

                        </p>


                        <div class="button-group">

                            <button class="cart-btn">

                                🛒 Add to Cart

                            </button>


                            <button class="buy-btn">

                                ⚡ Buy Now

                            </button>

                        </div>

                    `;


                    productContainer.appendChild(
                        productCard
                    );

                }
            );


            // =================================================
            // MONGODB PRODUCT BUY NOW → DETAILS
            // =================================================

            productContainer.addEventListener(
                "click",
                function (event) {

                    const buyButton =
                        event.target.closest(
                            ".buy-btn"
                        );


                    if (!buyButton) return;


                    const productCard =
                        buyButton.closest(
                            ".product-card"
                        );


                    if (!productCard) return;


                    const productName =
                        productCard
                            .querySelector("h3")
                            ?.innerText
                            .trim();


                    const product =
                        window.mongoProducts.find(
                            function (item) {

                                return (
                                    item.name ===
                                    productName
                                );

                            }
                        );


                    if (!product) {

                        alert(
                            "Product not found!"
                        );

                        return;
                    }


                    const detailPages = {

                        "Silk Saree":
                            "silk-saree-details.html",

                        "Men's T-Shirt":
                            "tshirt-details.html",

                        "Sports Shoes":
                            "sports-shoes-details.html",

                        "iPhone 16 Pro":
                            "iphone-details.html",

                        "Laptop":
                            "laptop-details.html",

                        "Smart Watch":
                            "smartwatch-details.html",

                        "Wireless Headphones":
                            "Airdopes-details.html",

                        "Travel Bag":
                            "travel-bag-details.html",

                        "Perfume":
                            "perfume-details.html",

                        "Boys Party Dress":
                            "boys-details.html",

                        "Men's Jacket":
                            "jacket-details.html",

                        "Sunglasses":
                            "sunglasses-details.html",

                        "Baggy Jeans":
                            "baggy-jeans-details.html",

                        "Kurti Set":
                            "kurti-details.html",

                        "Short One Piece":
                            "onepiece-details.html",

                        "Jewellery Set":
                            "jewellery-details.html",

                        "Women Casual Top":
                            "top-details.html",

                        "Women's Flats":
                            "sandal-details.html",

                        "Girls Sharara":
                            "girls-details.html",

                        "Embroidered Lehenga":
                            "lehenga-details.html"

                    };


                    const detailPage = detailPages[product.name];
                    localStorage.setItem(
                        "shopSphereSelectedProduct",
                        JSON.stringify(product)
                    );

                    if (detailPage) {
                        window.location.href = detailPage;
                    } else {
                        window.location.href = "product-details.html";
                    }



                }
            );


            // =================================================
            // PRODUCT NAME → DETAILS PAGE
            // =================================================

            productContainer.addEventListener(
                "click",
                function (event) {

                    const productLink =
                        event.target.closest(
                            ".product-link"
                        );


                    if (!productLink) return;


                    event.preventDefault();


                    const productCard =
                        productLink.closest(
                            ".product-card"
                        );


                    if (!productCard) return;


                    const productName =
                        productCard
                            .querySelector("h3")
                            ?.innerText
                            .trim();


                    const product =
                        window.mongoProducts.find(
                            function (item) {

                                return (
                                    item.name ===
                                    productName
                                );

                            }
                        );


                    if (!product) return;


                    const detailPages = {

                        "Silk Saree":
                            "silk-saree-details.html",

                        "Men's T-Shirt":
                            "tshirt-details.html",

                        "Sports Shoes":
                            "sports-shoes-details.html",

                        "iPhone 16 Pro":
                            "iphone-details.html",

                        "Laptop":
                            "laptop-details.html",

                        "Smart Watch":
                            "smartwatch-details.html",

                        "Wireless Headphones":
                            "Airdopes-details.html",

                        "Travel Bag":
                            "travel-bag-details.html",

                        "Perfume":
                            "perfume-details.html",

                        "Boys Party Dress":
                            "boys-details.html",

                        "Men's Jacket":
                            "jacket-details.html",

                        "Sunglasses":
                            "sunglasses-details.html",

                        "Baggy Jeans":
                            "baggy-jeans-details.html",

                        "Kurti Set":
                            "kurti-details.html",

                        "Short One Piece":
                            "onepiece-details.html",

                        "Jewellery Set":
                            "jewellery-details.html",

                        "Women Casual Top":
                            "top-details.html",

                        "Women's Flats":
                            "sandal-details.html",

                        "Girls Sharara":
                            "girls-details.html",

                        "Embroidered Lehenga":
                            "lehenga-details.html"

                    };


                    const detailPage =
                        detailPages[
                            product.name
                        ];


                    if (detailPage) {

                        localStorage.setItem(
                            "shopSphereSelectedProduct",
                            JSON.stringify(product)
                        );


                        window.location.href =
                            detailPage;

                    }

                }
            );


        } catch (error) {

            console.log(
                "Error loading products:",
                error
            );


            productContainer.innerHTML = `

                <p>
                    Unable to load products.
                </p>

            `;

        }

    }
);


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        displayCart();

        displayWishlist();

        updateWishlistHearts();

    }
);






// =====================================================
// SEARCH SYSTEM
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.querySelector(".search-box button");

    if (!searchInput) return;


    // =====================================================
    // PERFORM SEARCH
    // =====================================================

    function performSearch() {

        const searchText =
            searchInput.value.trim();


        if (searchText === "") {

            alert("Please enter a product name 🔍");

            return;
        }


        window.location.href =
            "products.html?search=" +
            encodeURIComponent(searchText);

    }


    // =====================================================
    // SEARCH BUTTON
    // =====================================================

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            performSearch
        );

    }


    // =====================================================
    // ENTER KEY SEARCH
    // =====================================================

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                performSearch();

            }

        }
    );

});




// =====================================================
// CATEGORY SYSTEM
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const categories =
        document.querySelectorAll(
            ".category h3[data-category]"
        );

    categories.forEach(function (category) {

        category.style.cursor = "pointer";

        category.addEventListener(
            "click",
            function () {

                const categoryName =
                    category.dataset.category;

                window.location.href =
                    "products.html?category=" +
                    encodeURIComponent(categoryName);

            }
        );

    });

});



// ===============================
// REGISTER USER
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // Check password
        if (password !== confirmPassword) {
            alert("Passwords do not match ❌");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Registration successful 🎉");

                window.location.href = "login.html";

            } else {

                alert(data.message || "Registration failed ❌");
            }

        } catch (error) {

            console.log(error);

            alert("Server connection failed ❌");
        }

    });

});



// ===============================
// LOGIN USER WITH JWT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // Save JWT token
                localStorage.setItem(
                    "shopSphereToken",
                    data.token
                );

                // Save user information
                localStorage.setItem(
                    "shopSphereUser",
                    JSON.stringify(data.user)
                );

                alert("Login successful 🎉");

                window.location.href = "index.html";

            } else {

                alert(data.message || "Login failed ❌");
            }

        } catch (error) {

            console.log(error);

            alert("Server connection failed ❌");
        }

    });

});




// ===============================
// LOGIN / LOGOUT NAVBAR
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const token =
        localStorage.getItem("shopSphereToken");

    const userData =
        localStorage.getItem("shopSphereUser");

    const navList =
        document.querySelector("nav ul");

    if (!navList) return;

    // User is logged in
    if (token && userData) {

        const user =
            JSON.parse(userData);

        // Remove Login and Register links
        const loginLink =
            navList.querySelector('a[href="login.html"]');

        const registerLink =
            navList.querySelector('a[href="register.html"]');

        if (loginLink) {
            loginLink.parentElement.remove();
        }

        if (registerLink) {
            registerLink.parentElement.remove();
        }

        // Welcome user
        const welcomeItem =
            document.createElement("li");

        welcomeItem.innerHTML =
            `👤 Welcome, ${user.name}`;

        navList.appendChild(welcomeItem);

        // Logout button
        const logoutItem =
            document.createElement("li");

        logoutItem.innerHTML =
            `<a href="#" id="logoutBtn">🚪 Logout</a>`;

        navList.appendChild(logoutItem);

        // Logout
        document
            .getElementById("logoutBtn")
            .addEventListener("click", function (event) {

                event.preventDefault();

                localStorage.removeItem("shopSphereToken");
                localStorage.removeItem("shopSphereUser");

                alert("Logout successful 👋");

                window.location.href = "login.html";
            });
    }

});



// ===============================
// LOAD PROTECTED USER PROFILE
// ===============================

async function loadUserProfile() {

    const token =
        localStorage.getItem("shopSphereToken");

    if (!token) {
        console.log("User is not logged in");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/users/profile",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (response.ok) {

            console.log("Protected Profile:", data);

        } else {

            console.log("Authentication failed:", data.message);

        }

    } catch (error) {

        console.log("Profile error:", error);

    }
}


loadUserProfile();


