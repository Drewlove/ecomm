//Object constructor for store products
function EcommItem(name, price, img, quantity){
	this.name = name; 
	this.price = price; 
	this.img = img; 
	this.quantity = quantity; 
}

//Data for name and price of store products
var invData = [
{name: "Apple", price: 1.50, img: "./assets/apple-pic.jpg", quantity: 100}, 
{name: "Orange", price: 1.25, img: "./assets/orange-pic.jpg", quantity: 100 },
{name: "Banana", price: 2.10, img: "./assets/banana-pic.jpg", quantity: 100 },
]
//Array of store products as objects
var invArray = [];

//Loops through objects in an array, calls an object constructor on each and pushes the new object into another array
function createInvArray(dataArray, newArray){
	dataArray.forEach(function (invObj){
		var newInvItem = new EcommItem(invObj.name, invObj.price, invObj.img, invObj.quantity); 
		newArray.push(newInvItem) 
	})
}
//Loops through invData to create a new object, which is then pushed into the store's inventory array (invArray)
createInvArray(invData, invArray); 

//object constructor for cart
function Cart(){
	var self = this; 
	//cartArray is an array of objects, each object an item from the store
	this.cartArray = []; 

	//from the "Shop" screen, adds an item and updates item's quantity in the user's cart
	this.addItemToCart = function addItemToCart(itemObj){
		var inputQuantity = document.getElementById(itemObj.name+"-shop-quantity"); 
		var inputQuantityValue = parseInt(inputQuantity.value);

		if(isNaN(inputQuantityValue)){
	 		inputQuantityValue = 1; 
	 	}
		var itemAlreadyInCart = false; 

		//updates cart quantity: if product already in user's cart, updates quantity 
		self.cartArray.forEach(function (cartObj){
			if(cartObj.name === itemObj.name){
				itemAlreadyInCart = true;   
				cartObj.quantity += inputQuantityValue;
				inputQuantity.value = ""; 
				self.subtotal(cartObj);  
				return; 
				}
			})
		//if product is not in user's cart, adds new item to user's cart with inputted quantity
		if(itemAlreadyInCart === false){
			itemObj.quantity = inputQuantityValue; 
			self.cartArray.push(itemObj); 
			self.subtotal(itemObj); 
			inputQuantity.value = ""; 
			return; 
		}		
	}

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

//creates an instance of the cart from the object constructor
var ecommCart = new Cart(); 

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

//renders "Shop" page when user clicks on "Shop"
function renderShop(arrayOfObj){
	var container = document.getElementById("main"); 
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	container.className="shop-container";

	arrayOfObj.forEach(function (itemObj){
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
		var addToCartTxt = document.createTextNode("Add to Cart");
		productContainer.appendChild(addToCartBtn).appendChild(addToCartTxt); 
		addToCartBtn.addEventListener("click", function(){
			ecommCart.addItemToCart(itemObj)
		}); 
	}); 
};

document.getElementById("shop").addEventListener("click", function(){
	renderShop(invArray)
}); 

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

//render "Home" page on load
window.onload = renderHomePage(); 







