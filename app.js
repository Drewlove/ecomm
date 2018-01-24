//TODO: rename class of main element depending upon what user clicks. click on shop, main element is class main, 
//click on cart element, main element is cart
//class cart and shop should display items as display: flex, flex-wrap: wrap, and change the image size to 75%

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

//Data for name and price of store products
var invData = [
{name: "Apple", price: 1.50, img: "./assets/apple-pic.jpg", quantity: 100}, 
{name: "Orange", price: 1.25, img: "./assets/orange-pic.jpg", quantity: 100 },
{name: "Banana", price: 2.10, img: "./assets/banana-pic.jpg", quantity: 100 },
]
//Array of store products as objects
var invArray = [];

//Array of store products as objects in user's cart
var cartArray = [];

//Calculates total price of all products in user's cart
function cartTotal(){
	var cartTotalText = document.getElementById("title-text");
	var cartTotal = 0

	cartArray.forEach(function (cartObj){
		var itemTotal = cartObj.quantity*cartObj.price;
		cartTotal += parseFloat(itemTotal.toFixed(2)); 
	})
	cartTotalText.innerHTML= "Cart Total: $"+cartTotal.toFixed(2); 
}

//Object constructor for store products
function EcommItem(name, price, img){
	var self = this;
	this.name = name; 
	this.price = price; 
	this.img = img; 
	this.quantity = 1; 

	//adds the item from inventory to user's cart
	this.addToCart = function addToCart(){
		var inputQuantity = document.getElementById(self.name+"-preCart-quantity"); 
		var inputQuantityValue = parseInt(inputQuantity.value);
		if(isNaN(inputQuantityValue)){
	 		inputQuantityValue = 1; 
	 	}
		var itemAlreadyInCart = false; 

		//updates cart quantity: if product already in user's cart, updates quantity with number entered by user within the cart display 
		cartArray.forEach(function (cartItem){
			if(cartItem.name === self.name){
				itemAlreadyInCart = true;   
				cartItem.quantity += inputQuantityValue;
				inputQuantity.value = "";    
				return 
				}
			})
		//if product not in user's cart, adds new item to user's cart
		if(itemAlreadyInCart === false){
			self.quantity = inputQuantityValue; 
			cartArray.push(self); 
			inputQuantity.value = ""; 
			return 
		}		
	}
	//if user clicks on cart quantity input, resets input to blank value  
	this.resetQuantity = function resetQuantity(){; 
		var quantityContainer = document.getElementById(self.name+"-cart-quantity");
		quantityContainer.value = ""; 
	}
	//removes item from user's cart
	this.removeFromCart = function removeFromCart(){
		console.log(self); 
		cartArray.forEach(function (cartItem){
			if(cartItem.name === self.name){
				var cartItemIndex = cartArray.indexOf(cartItem); 
				cartArray.splice(cartItemIndex, 1); 
			}
		})
		var cartItem = document.getElementById(self.name+"-cart-item"); 
		var removeBtn = document.getElementById(self.name+"-remove-btn")
		console.log(cartItem, removeBtn); 

		cartItem.parentElement.removeChild(cartItem);
		removeBtn.parentElement.removeChild(removeBtn);

		cartTotal(); 
	}
	//updates cart quantity: takes number entered by user within the cart display 
	this.updateQuantity = function updateQuantity(){ 
		var newQuantity = document.getElementById(self.name+"-cart-quantity");
		var newQuantityValue = parseInt(newQuantity.value); 

		if(isNaN(newQuantityValue)){
			newQuantityValue = 1; 
			newQuantity.value = 1; 
		} 
		self.quantity = newQuantityValue; 
		var totalPriceContainer = document.getElementById(self.name+"-totalPrice"); 
		totalPriceContainer.innerHTML = "Total Price: $"+(self.price*self.quantity).toFixed(2); 
		cartTotal(); 
	}
}
//Loops through objects in an array, calls an object constructor on each and pushes the new object into another array
function createInvArray(dataArray, newArray){
	objValues = []; 
	dataArray.forEach(function (invObj){
		var newInvItem = new EcommItem(invObj.name, invObj.price, invObj.img); 
		newArray.push(newInvItem) 
	})
}
//Loops through invData to create a new object, which is then pushed into the store's inventory array (invArray)
createInvArray(invData, invArray); 

function calcSubTotal(product, quantity){ 
	product.quantity = parseInt(quantity); 
	var subTotalText = document.getElementById(product.name+"-subTotal");
	product.quantity = parseInt(quantity);
	var subTotalValue = parseFloat(product.quantity*product.price).toFixed(2);
	subTotalText.innerHTML="Subtotal: $"+subTotalValue;
	cartTotal(); 
}

//loops through the objects in an array and creates HTML elements to display the object in the browser
function renderProduct(arrayName, containerName){
	var container = document.getElementById("main"); 
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	container.className="shop-container";

	arrayName.forEach(function (itemObj){
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

		containerName==="inventory"
		quantityInput.placeholder= 1; 
		quantityInput.setAttribute("id", itemObj.name+"-preCart-quantity");
		var addToCartBtn = document.createElement("button"); 
		var addToCartTxt = document.createTextNode("Add to Cart");
		productContainer.appendChild(addToCartBtn).appendChild(addToCartTxt); 
		addToCartBtn.addEventListener("click", itemObj.addToCart);	
	})
}

function renderCart(){
	var container = document.getElementById("main"); 
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	container.className="main-cart-container";

	var totalPriceContainer = document.createElement("h1"); 
	var totalPriceText = document.createTextNode("Total Price: $"+cartTotal); 
	totalPriceContainer.setAttribute("id", "total-price");

	container.appendChild(totalPriceContainer);

	cartArray.forEach(function (cartObj){
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
			calcSubTotal(cartObj, quantityInput.value)
			}); 
		var subTotalTextContainer = document.createElement("p"); 
		subTotalTextContainer.setAttribute("id", cartObj.name+"-subTotal"); 

		var removeButton = document.createElement("button"); 
		var removeButtonText = document.createTextNode("Remove"); 
		removeButton.className = "remove-btn"; 
		removeButton.setAttribute("id", cartObj.name+"-remove-btn")
		removeButton.appendChild(removeButtonText);
		removeButton.addEventListener("click", cartObj.removeFromCart);

		container.appendChild(cartItemContainer); 
		cartItemContainer.appendChild(cartInfoContainer);
		cartItemContainer.appendChild(removeButton);

		cartInfoContainer.appendChild(cartObjImg);
		cartInfoContainer.appendChild(cartObjNameContainer).appendChild(cartObjName);
		cartInfoContainer.appendChild(priceTextContainer); 
		cartInfoContainer.appendChild(quantityTextContainer).appendChild(quantityText); 
		cartInfoContainer.appendChild(quantityInput);
		cartInfoContainer.appendChild(subTotalTextContainer); 

		cartInfoContainer.className="cart-info-container";
		cartInfoContainer.setAttribute("id", cartObj.name+"-cart-item"); 
		cartObjImg.setAttribute("src", cartObj.img); 
		cartObjImg.className="cart-img";
		cartObjNameContainer.className="cart-item";
		priceTextContainer.className="cart-item";
		quantityTextContainer.className="cart-item";
		subTotalTextContainer.className="cart-item";

		calcSubTotal(cartObj, quantityInput.value);
		cartTotal(); 

		var text = document.getElementById(cartObj.name+"-subTotal"); 
	})
}


document.getElementById("shop").addEventListener("click", function(){
	renderProduct(invArray, "inventory")
	}); 
document.getElementById("cart").addEventListener("click", renderCart);
window.onload = renderHomePage(); 







