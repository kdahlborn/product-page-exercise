const log = (msg) => console.log(msg);

let cart = [];
const cartQtyRef = document.querySelector('.cart-btn__qty');
cartQtyRef.classList.add('d-none');
const cartRef = document.querySelector('.cart-wrapper');
cartRef.classList.add('d-none');
const cartBtnRef = document.querySelector('#cartBtn');
cartBtnRef.addEventListener('click', () => {
    cartRef.classList.toggle('d-none');
});
const cartCTARef = document.querySelector('.cart__cta');
cartCTARef.classList.add('v-hidden');
menuSetup();

function menuSetup() {
    const menuRef = document.querySelector('#productMenu');

    for (let item of menu) {
        const product = createProduct(item);
        menuRef.appendChild(product);
    }
}

function createProduct(product) {
    const productRef = document.createElement('li');
    productRef.classList.add('product');
    productRef.addEventListener('click', () => {
        productRef.classList.toggle('expanded');
    });

    // Button
    const btnRef = document.createElement('button');
    btnRef.classList.add('product__btn');
    btnRef.textContent = '+';
    productRef.appendChild(btnRef);
    btnRef.addEventListener('click', (event) => {
        event.stopPropagation();
        addToCart(product);
    });

    // Info
    const sectionRef = document.createElement('section');
    sectionRef.classList.add('product__info');
    productRef.appendChild(sectionRef);
    // name
    const name = getProductName(product);
    sectionRef.appendChild(name);
    // Description
    const desc = getProductDesc(product);
    sectionRef.appendChild(desc);
    // Long description
    const longDesc = getProductLongDesc(product);
    sectionRef.appendChild(longDesc);
    // Image
    const img = getProductImg(product);
    sectionRef.appendChild(img);
    // Price
    const price = getProductPrice(product);
    productRef.appendChild(price);

    return productRef;
}

// GET PRODUCT IMG
function getProductImg(product) {
    const imgRef = document.createElement('img');
    imgRef.src = product.image;
    imgRef.classList.add('product__img');
    return imgRef;
}

// GET PRODUCT NAME
function getProductName(product) {
    const nameRef = document.createElement('h2');
    nameRef.classList.add('product__title');
    nameRef.textContent = product.title;
    return nameRef;
}

// GET PRODUCT LONG DESCRIPTION
function getProductLongDesc(product) {
    const longDescRef = document.createElement('p');
    longDescRef.classList.add('product__desc', 'product__desc--long');
    longDescRef.textContent = product.longer_desc;
    return longDescRef;
}

// GET PRODUCT DESCRIPTION
function getProductDesc(product) {
    const descRef = document.createElement('p');
    descRef.classList.add('product__desc', 'product__desc--short');
    descRef.textContent = product.desc;
    return descRef;
}

// GET PRODUCT PRICE
function getProductPrice(product) {
    const priceRef = document.createElement('h3');
    priceRef.classList.add('product__price');
    priceRef.textContent = product.price + ' kr';
    return priceRef;
}

// ADD TO CART
function addToCart(product) {
    cart.push(product);
    log(`${product.title} lades till i varukorgen`);

    if (productExist(product)) {
        renderCart(product);
    } else {
        createCartItem(product);
    }
}

function createCartItem(product) {
    const cartListRef = document.querySelector('#cartList');
    // CART ITEM
    const itemRef = document.createElement('li');
    itemRef.classList.add('item');
    itemRef.dataset.id = product.id;
    cartListRef.appendChild(itemRef);

    // INFO
    const itemInfoRef = document.createElement('div');
    itemInfoRef.classList.add('item__info');
    itemRef.appendChild(itemInfoRef);
    // Name
    const itemNameRef = document.createElement('h4');
    itemNameRef.classList.add('item__name');
    itemNameRef.textContent = product.title;
    itemInfoRef.appendChild(itemNameRef);

    // Price
    const itemPriceRef = document.createElement('p');
    itemPriceRef.classList.add('item__price');
    itemPriceRef.textContent = `${product.price} kr`;
    itemInfoRef.appendChild(itemPriceRef);

    // QUANTITY
    const itemQtyRef = document.createElement('div');
    itemQtyRef.classList.add('qty');
    itemRef.appendChild(itemQtyRef);
    // Increase button
    let qtyBtnRef = document.createElement('button');
    qtyBtnRef.classList.add('qty__btn');
    qtyBtnRef.id = 'increase';
    qtyBtnRef.innerHTML = `
        <i class="fa-solid fa-angle-up" style="color: #2f2926"></i>
        `;
    itemQtyRef.appendChild(qtyBtnRef);
    qtyBtnRef.addEventListener('click', (event) => {
        addToCart(product);
    });

    // Quantity number
    const qtyNumRef = document.createElement('p');
    qtyNumRef.classList.add('qty__num');
    qtyNumRef.textContent = getItemQty(product);
    log(getItemQty(product));
    itemQtyRef.appendChild(qtyNumRef);
    // decrease button
    qtyBtnRef = document.createElement('button');
    qtyBtnRef.classList.add('qty__btn');
    qtyBtnRef.classList.add('qty__btn--down');
    qtyBtnRef.id = 'decrease';
    qtyBtnRef.innerHTML = `
        <i class="fa-solid fa-angle-up" style="color: #2f2926"></i>
        `;
    itemQtyRef.appendChild(qtyBtnRef);
    qtyBtnRef.addEventListener('click', (event) => {
        decreaseQty(product);
    });
    renderCart(product);
}

function getItemQty(product) {
    return cart.filter((item) => item === product).length;
}

function calculateTotalPrice(list) {
    let totalPrice = 0;
    for (item of list) {
        totalPrice += item.price;
    }
    return totalPrice;
}

function getItemList(list, product) {
    return list.filter((item) => item === product);
}

function productExist(product) {
    return getItemQty(product) >= 2;
}

function renderCart(product) {
    const item = document.querySelector(`[data-id="${product.id}"]`);
    item.querySelector('.item__price').textContent =
        `${product.price * getItemQty(product)} kr`;
    item.querySelector('.qty__num').textContent = getItemQty(product);

    const totalPriceRef = document.querySelector('.summary__price');
    totalPriceRef.textContent = `${calculateTotalPrice(cart)} kr`;

    if (getItemQty(product) === 0) {
        item.remove();
        cartQtyRef.classList.add('d-none');
    }
    if (cart.length > 0) {
        cartQtyRef.classList.remove('d-none');
        cartQtyRef.textContent = cart.length;
        const cartTitleRef = document.querySelector('.cart__title');
        cartTitleRef.textContent = 'Din beställning';
        cartCTARef.classList.remove('v-hidden');
    } else {
        const cartTitleRef = document.querySelector('.cart__title');
        cartTitleRef.textContent = 'Varukorgen är tom';
        cartCTARef.classList.add('v-hidden');
    }
}

function decreaseQty(product) {
    const index = cart.indexOf(product);
    cart.splice(index, 1);
    renderCart(product);
}
