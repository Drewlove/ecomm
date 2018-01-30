//Data for name and price of store products
var invData = [
{name: "Apple", price: 1.50, img: "./assets/apple-pic.jpg", quantity: 100},
{name: "Orange", price: 1.25, img: "./assets/orange-pic.jpg", quantity: 100 },
{name: "Banana", price: 2.10, img: "./assets/banana-pic.jpg", quantity: 100 },
]

//Object constructor for store products
function Shop(invData){
	var self = this; 
	
	this.shopProductArray = []; 

	this.quantityInputError= function quantityInputError(){
		console.log("quantity input error")
		// self.errorMessages = true; 
		// userInputValue = input.value; 
		// var selectedProduct = document.getElementById(productObj.name); 

		// var warningMessageContainer = document.createElement("p"); 
		// var warningText = document.createTextNode("Enter a number. ''"+input.value+"'' is not a number.");
		// selectedProduct.appendChild(warningMessageContainer); 
		// warningMessageContainer.appendChild(warningText); 
		// warningMessageContainer.setAttribute("class", "error-message");
		// self.errorMessage = input.value; 
	}
	

	this.createShopProductArray = function createShopProductArray(){
		invData.forEach(function (productObj){ 
			var newProductObj = {}; 
			newProductObj.name = productObj.name;
			newProductObj.price = productObj.price;
			newProductObj.img = productObj.img;
			newProductObj.quantity = productObj.quantity;

			self.shopProductArray.push(newProductObj)
		})
	}; 


	function renderShop(){ 
		var container = document.getElementById("main");
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		container.className="shop-container";

		self.shopProductArray.forEach(function (itemObj){ 
			var productContainer = document.createElement("div");
			productContainer.setAttribute("id", itemObj.name);
			productContainer.className="product";
			var productTextContainer = document.createElement("h1");
			productTextContainer.className="product-name";
			var productName = document.createTextNode(itemObj.name);
			container.appendChild(productContainer).appendChild(productTextContainer).appendChild(productName);

			var productImg = document.createElement("img");
			productImg.setAttribute("src", itemObj.img);
			productContainer.appendChild(productImg);
			productImg.className="product-img";

			var priceContainer = document.createElement("p");
			priceContainer.className="product-price"
			var price = itemObj.price;
			var priceText = document.createTextNode("Price: $"+price.toFixed(2)+"")
			productContainer.appendChild(priceContainer).appendChild(priceText);

			var quantityTextContainer = document.createElement("p");
			quantityTextContainer.className = "quantity"
			var quantityText = document.createTextNode("Quantity: ");
			var quantityInput = document.createElement("input");

			quantityInput.className="quantity"
			productContainer.appendChild(quantityTextContainer).appendChild(quantityText);
			productContainer.appendChild(quantityInput);

			quantityInput.placeholder= 1;
			quantityInput.setAttribute("id", itemObj.name+"-shop-quantity");
			var addToCartBtn = document.createElement("button");
			addToCartBtn.setAttribute("id", itemObj.name+"-add-btn");
			var addToCartTxt = document.createTextNode("Add to Cart");
			productContainer.appendChild(addToCartBtn).appendChild(addToCartTxt);
			addToCartBtn.addEventListener("click", function(){
				ecommCart.addItemToCart(itemObj)
			});
		});
	};
	document.getElementById("shop").addEventListener("click", renderShop);	
};

//object constructor for cart
function Cart(){
	var self = this;
		//renders "Cart" page when user clicks on "Cart"
		function renderCart(){
			var container = document.getElementById("main");
				while (container.firstChild) {
					container.removeChild(container.firstChild);
				}
				container.className="main-cart-container";

				var totalPriceContainer = document.createElement("h1");
				var totalPriceTextContainer = document.createTextNode("Total Price: $"+ecommCart.cartTotal());
				totalPriceContainer.appendChild(totalPriceTextContainer);

				container.appendChild(totalPriceContainer);
				totalPriceContainer.setAttribute("id", "total-price");

				(ecommCart.cartArray).forEach(function (cartObj){
					var cartItemContainer = document.createElement("div");
					var cartObjImg = document.createElement("img");
					var cartObjNameContainer = document.createElement("p");
					var cartObjName = document.createTextNode(cartObj.name);
					var cartInfoContainer = document.createElement("div");

					var priceTextContainer = document.createElement("p");
					var priceText = document.createTextNode("Price: $"+parseFloat(cartObj.price).toFixed(2));
					priceTextContainer.appendChild(priceText);

					var quantityTextContainer = document.createElement("p");
					var quantityText = document.createTextNode("Quantity: ");
					var quantityInput = document.createElement("input");
					quantityInput.value=cartObj.quantity;
					quantityInput.addEventListener("change", function(){
						ecommCart.updateQuantity(cartObj)
					});

					var subtotalTextContainer = document.createElement("p");
					var subtotalText = document.createTextNode("Subtotal: $"+parseFloat(cartObj.subtotal).toFixed(2));
					subtotalTextContainer.appendChild(subtotalText);
					subtotalTextContainer.setAttribute("id", cartObj.name+"-subtotal");

					var removeButton = document.createElement("button");
					var removeButtonText = document.createTextNode("Remove");
					removeButton.className = "remove-btn";
					removeButton.setAttribute("id", cartObj.name+"-remove-btn")
					removeButton.appendChild(removeButtonText);
					removeButton.addEventListener("click", function(){
						ecommCart.removeFromCart(cartObj);
					});

					container.appendChild(cartItemContainer);
					cartItemContainer.appendChild(cartInfoContainer);
					cartItemContainer.appendChild(removeButton);

					cartInfoContainer.appendChild(cartObjImg);
					cartInfoContainer.appendChild(cartObjNameContainer).appendChild(cartObjName);
					cartInfoContainer.appendChild(priceTextContainer);
					cartInfoContainer.appendChild(quantityTextContainer).appendChild(quantityText);
					cartInfoContainer.appendChild(quantityInput);
					cartInfoContainer.appendChild(subtotalTextContainer);

					cartInfoContainer.className="cart-info-container";
					cartInfoContainer.setAttribute("id", cartObj.name+"-cart-item");
					cartObjImg.setAttribute("src", cartObj.img);
					cartObjImg.className="cart-img";
					cartObjNameContainer.className="cart-item";
					priceTextContainer.className="cart-item";
					quantityTextContainer.className="cart-item";
					subtotalTextContainer.className="cart-item";
					cartItemContainer.setAttribute("id", cartObj.name+"-cart-item");
					quantityInput.setAttribute("id", cartObj.name+"-cart-quantity");
				})
			}

			document.getElementById("cart").addEventListener("click", renderCart);

			//an array of product objects in the user's cart
			this.cartArray = [];

			//Tracks if the page has an error message. Error messages appear when user enters invalid quantity input.

			//From the "Shop" page adds a new item to the user's cart, or updates the item's quantity in the user's cart
			this.addItemToCart = function addItemToCart(itemObj){
				var inputQuantity = document.getElementById(itemObj.name+"-shop-quantity");
				var inputQuantityValue = parseInt(inputQuantity.value);
				if(isNaN(inputQuantityValue)){ 
					return Shop.call(this, quantityInputError); 
				}; 

				var itemAlreadyInCart = false;
				//if product is already in user's cart, updates quantity
				self.cartArray.forEach(function (cartObj){
					if(cartObj.name === itemObj.name){
						itemAlreadyInCart = true;
						cartObj.quantity += inputQuantityValue;
						inputQuantity.value = "";
						self.subtotal(cartObj);
						return;
					};
				});
				//if product is not in user's cart, adds new item to user's cart with inputted quantity
				if(itemAlreadyInCart === false){
					itemObj.quantity = inputQuantityValue;
					self.cartArray.push(itemObj);
					self.subtotal(itemObj);
					inputQuantity.value = "";
					return;
				};
			};

	//from the "Cart" page, updates the quantity of an item in the user's cart
	this.updateQuantity = function updateQuantity(cartObj){
		var value = parseInt(document.getElementById(cartObj.name+"-cart-quantity").value);
		self.cartArray.forEach(function (cartItem){
			if(cartItem.name === cartObj.name){
				cartItem.quantity = value;
			}
		})
		self.cartArray.forEach(function (cartItem){
			cartItem.subtotal = self.subtotal(cartItem);
		})
		renderCart();
	}

	//calculates the subtotal property for each item in user's cart
	this.subtotal = function subtotal(cartObj){
		return cartObj.subtotal = cartObj.quantity*cartObj.price;
	}

	//adds subtotals together to calculate total price
	this.cartTotal = function cartTotal(){
		var totalPrice = 0;

		self.cartArray.forEach(function (cartObj){
			totalPrice += cartObj.subtotal;
		});
		return parseFloat(totalPrice).toFixed(2);
	};

	//removes item from cart
	this.removeFromCart = function removeFromCart(cartObj){
		var cartItemIndex = self.cartArray.indexOf(cartObj);
		self.cartArray.splice(cartItemIndex, 1);
		renderCart();
	}
};

//renders the "Home" page when user clicks on "Home"
function renderHomePage(){
	var main = document.getElementById("main");
	main.classList.remove("shop-container")

	while (main.firstChild) {
		main.removeChild(main.firstChild);
	}
	var greetingContainer = document.createElement("h1");
	var greetingText = document.createTextNode("Welcome to the Produce Emporium!");
	var imageContainer = document.createElement("img");
	main.appendChild(greetingContainer).appendChild(greetingText);
	main.appendChild(imageContainer);

	greetingContainer.className="greeting"
	imageContainer.className="home-img"
	imageContainer.setAttribute("src", "./assets/home-pic.jpg");
}
//calls render function on array of inventory objects
document.getElementById("home").addEventListener("click", renderHomePage);


var ecommCart = new Cart();
var ecommShop = new Shop(invData); 
ecommShop.createShopProductArray(); 

//render "Home" page on load
window.onload = renderHomePage();

