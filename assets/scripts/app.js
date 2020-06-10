class Product {
    // title = "Default";
    // imageUrl;
    // description;
    // price;

    constructor(title, img, desc, price) {
        this.title = title;
        this.imageUrl = img;
        this.description = desc;
        this.price = price;
    }
}

class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {

    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if(shouldRender){
            this.render();
        }
        
    }

    render() { }

    createRootElement(tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }

        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component {
    items = [];


    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
    }

    get totalAmount() {
        const sum = this.items.reduce((prevValue, curItem) => {
            return prevValue + curItem.price;
        }, 0);
        return sum;
    }

    constructor(renderHookId) {
        super(renderHookId);
    }

    // addProduct(product) {
    //     this.items.push(product);
    //     this.totalOutput.innerHTML = `<h2>Total: \$${1}</h2>`
    // }
    addProduct(product) {
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems; // calling setters

    }

    orderProducts() {
        console.clear();
        console.log("Ordering...");
        console.log(this.items);
    }

    render() {
        let cartEl = this.createRootElement('section', 'cart');
        cartEl.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now</button>
        `;
        const orderBtn = cartEl.querySelector('button');
        orderBtn.addEventListener('click', () => this.orderProducts());
        this.totalOutput = cartEl.querySelector('h2');
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render();
    }

    addToCart() {
        console.log("Adding Product To Cart ", this.product);
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement("li", 'product-item');
        prodEl.innerHTML = `
            <div>
                <img src="${this.product.imageUrl}" alt="${this.product.title}">
                <div class="product-item__content">
                    <h2>${this.product.title}</h2>
                    <h3>\$${this.product.price}</h3>
                    <p>${this.product.description}</p>
                    <button>Add To Cart</button>
                </div>
            </div>
        `;
        const addCartBtn = prodEl.querySelector('button');
        addCartBtn.addEventListener('click', this.addToCart.bind(this));

    }
}

class ProductList extends Component {
    products = [];

    constructor(renderHookId) {
        super(renderHookId);
        this.fetchProductList();
    }

    fetchProductList() {
        this.products = [
            new Product(
                "A pillow",
                "https://media.decathlon.sg/1749274-thickbox_default/camping-pillow-comfort.jpg",
                "A soft bluish pillow talk",
                10.99
            ),
            new Product(
                "A Carpet",
                "https://upload.wikimedia.org/wikipedia/commons/7/71/Ardabil_Carpet.jpg",
                "A persian carpet",
                24.99
            )
        ]
        this.renderProducts();
    }

    renderProducts() {
        for (const prod of this.products) {
            new ProductItem(prod, 'prod-list')
        }
    }

    render() {
        this.createRootElement("ul", 'product-list', [new ElementAttribute('id', 'prod-list')]);
        if(this.products && this.products.length >0) {
            this.renderProducts();
        }
    }
}

class Shop {
    constructor() {
        this.render();
    }
    render() {
        // const renderHook = document.getElementById("app");
        this.cart = new ShoppingCart('app');
        new ProductList('app');

        // renderHook.append(cartEl);
        // renderHook.append(prodListEl);
    }
}


class App {
    static cart;

    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();
