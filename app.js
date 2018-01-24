//Data for name and price of store products
var invData = [
//ADD A QUANTITY PROPERTY AND RELEVANT METHODS/PARTS OF METHODS THAT QUERY INVENTORY
//ADD AND SUBTRACT TO INVENTORY AS ITS MOVED TO AN ORDER
//PREVENTS ADDING ITEMS IF INVENTORY === 0
{name: "apples", price: 1.50},
{name: "oranges", price: 1.25 },
{name: "bananas", price: 2.10 }
]
//Array of store products as objects

var invArray = [];

//Array of store products as objects in user's cart
var cartArray = [];

//Calculates total price of all products in user's cart
function cartTotal(){
	var cartTotalContainer = document.getElementById("cart-total");
	var cartTotal = 0

	cartArray.forEach(function (cartObj){
		var itemTotal = cartObj.quantity*cartObj.price;
		cartTotal += parseFloat(itemTotal.toFixed(2));
	})
	cartTotalContainer.innerHTML= "$"+cartTotal.toFixed(2);
}

//Object constructor for store products
//BROADLY, W/O DELVING TOO FAR IN, I WOULD IMAGINE THE ITEM/CART/ORDER
//RELATIONSHIP TO LOOK SOMETHING LIKE:
//OBJECT THAT CREATES ARRAY OF ITEM OBJECTS-instantiating this as a global, allows it to
//be passed to other objects, so that it can be "used" by inventory display
//passed and "used" by cart
//passed and "used" by ORDER
//IN THIS PARADIGM WE HAVE ONE SOURCE OF INVENTORY (THE GLOBAL INSTANTIATED)
//WE CAN PASS IT TO CART, THEN CART RELATED FUNCTIONS CAN ADD MEMBERS  TO THEIR CART ARRAY,
//(LOCAL TO AN INSTANTIATED CART OBJECT), QUERY MEMBERS FOR INVENTORY, CHANGE INVENTORY NUMBERS ETC
//IT WILL STILL BE THE SAME SINGLE SOURCE.  THIS IS KIND OF THE OO PARADIGM,
//DISCRETE ELEMENTS DETERMINED BY PURPOSE, THAT ARE PASSED TO OTHER OBJECTS SO THAT THOSE OBJECTS CAN
//ACCESS RELEVANT PROPERTIES/METHODS

function EcommItem(name, price){
	var self = this;
	this.name = name;
	this.price = price;
	this.quantity = 1;

	//adds the item from inventory to user's cart
	//TO CONSIDER: THERE SHOULD PROBABLY BE CART AND ORDER SEPARATE FROM ONE ANOTHER
	//CART WILL DISPLAY ITEMS, QUANTITY, PRICES
	//CHECKOUT BUTTON WILL TOTAL UP ORDER AND DISPLAY IT
	//EcommITem and Cart are PROB SEPARATE OBJECTS SEEMS TO ME CART METHODS DONT BELONG ON EcommItem
	//**TO THINK ABOUT: REALLY TEASE OUT WHAT THE CART DOES WHAT THE ORDER DOES, AND WHATS "AT THE CENTER"
	//AS AN EXERCISE WE'LL ESSENTIALLY BE PASSING THE INVENTORY OBJECT INTO OTHER OBJECTS SO THAT THEY CAN ACCESS IT
	//TO DISPLAY INVENTORY, CART INVENTORY AND COMPLETE AN ORDER FOR INVENTORY.  OBJECT DESIGN AND INTERACTION BETWEEN
	//SHOULD BE GUIDED BY THOSE CONSIDERATIONS
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
				renderProduct(cartArray, "cart");
				cartTotal();
				return
				}
			})
		//if product not in user's cart, adds new item to user's cart
		if(itemAlreadyInCart === false){
			self.quantity = inputQuantityValue;
			cartArray.push(self);
			inputQuantity.value = "";
			renderProduct(cartArray, "cart");
			cartTotal();
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
		cartArray.forEach(function (cartItem){
			if(cartItem.name === self.name){
				var cartItemIndex = cartArray.indexOf(cartItem);
				cartArray.splice(cartItemIndex, 1);
				renderProduct(cartArray, "cart");
			}
		})
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
	dataArray.forEach(function (invObj){
		var newInvItem = new EcommItem(invObj.name, invObj.price);
		newArray.push(newInvItem)
	})
}

//Loops through invData to create a new object, which is then pushed into the store's inventory array (invArray)
createInvArray(invData, invArray);

//loops through the objects in an array and creates HTML elements to display the object in the browser
function renderProduct(arrayName, containerName){
	var container = document.getElementById(containerName);
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}

	arrayName.forEach(function (itemObj){
		var productContainer = document.createElement("div");
		productContainer.setAttribute("id", itemObj.name);
		productContainer.className="product";
		var productTextContainer = document.createElement("p");
		productTextContainer.className="product-name";
		var productName = document.createTextNode(itemObj.name);
		container.appendChild(productContainer).appendChild(productTextContainer).appendChild(productName)

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

		if(containerName==="inventory"){
			quantityInput.placeholder= 1;
			quantityInput.setAttribute("id", itemObj.name+"-preCart-quantity");
			var addToCartBtn = document.createElement("button");
			var addToCartTxt = document.createTextNode("Add to Cart");
			productContainer.appendChild(addToCartBtn).appendChild(addToCartTxt);
			addToCartBtn.addEventListener("click", itemObj.addToCart);

		} else if (containerName==="cart"){
			quantityInput.setAttribute("id", itemObj.name+"cart-quantity");
			var totalPriceContainer = document.createElement("p");
			var totalPrice = (itemObj.price*itemObj.quantity).toFixed(2);
			var totalPriceNumber = document.createTextNode("Total Price: $"+totalPrice);
			productContainer.appendChild(totalPriceContainer).appendChild(totalPriceNumber);
			totalPriceContainer.setAttribute("id", itemObj.name+"-totalPrice");
			document.getElementById(itemObj.name+"cart-quantity").addEventListener("click", itemObj.resetQuantity);

			var updateQuantityBtn = document.createElement("button");
			var updateQuantityTxt = document.createTextNode("Update Quantity");
			productContainer.appendChild(updateQuantityBtn).appendChild(updateQuantityTxt);
			updateQuantityBtn.className="update-btn";
			updateQuantityBtn.addEventListener("click", itemObj.updateQuantity)

			quantityInput.setAttribute("id", itemObj.name+"-cart-quantity");
			quantityInput.value = itemObj.quantity;
			var removeFromCartBtn = document.createElement("button");
			var RemoveFromCartTxt = document.createTextNode("Remove");
			productContainer.appendChild(removeFromCartBtn).appendChild(RemoveFromCartTxt);
			removeFromCartBtn.addEventListener("click", itemObj.removeFromCart);
		}
	})
}

//calls render function on array of inventory objects
renderProduct(invArray, "inventory")
