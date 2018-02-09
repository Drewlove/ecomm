/* 
ToDO: 
**maybe use index and cartObj, look at removeFromCart function for example

something

get a linter 

*/

//Data for name and price of store products
var invData = [
{name: "Apple", price: 1.50, img: "./assets/apple-pic.jpg", invCount: 100},
{name: "Orange", price: 1.25, img: "./assets/orange-pic.jpg", invCount: 100 },
{name: "Banana", price: 2.10, img: "./assets/banana-pic.jpg", invCount: 100 },
]

function Product(name, price, img, quantity){
	this.name = name;
	this.price = price;
	this.img = img;
	this.quantity = quantity;
}

//Object constructor for store products
function Shop(invData){
	var self = this; 

	function renderShop(){ 
		var container = document.getElementById("main");
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		container.className="shop-container";

		invData.forEach(function (itemObj){ 
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
			quantityInput.setAttribute("id", itemObj.name+"-shop-quantity");

			var addToCartBtn = document.createElement("button");
			addToCartBtn.setAttribute("id", itemObj.name+"-add-btn");
			var addToCartTxt = document.createTextNode("Add to Cart");
			productContainer.appendChild(addToCartBtn).appendChild(addToCartTxt);

			var inventoryTextContainer = document.createElement("p"); 
			var inventoryText = document.createTextNode("Available: "+itemObj.invCount); 
			inventoryTextContainer.setAttribute("id", itemObj.name+"-inv-count")
			inventoryTextContainer.appendChild(inventoryText); 
			productContainer.appendChild(inventoryTextContainer); 
			//QUESTION: Should this call a method listed in the Cart object constructor, rather than the instance of it?
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

	//an array of product objects in the user's cart
	this.cartArray = [];
	//renders "Cart" page when user clicks on "Cart"

	document.getElementById("cart").addEventListener("click", function(){
		self.renderCart();
	});

	this.renderCart = function renderCart(){
		var container = document.getElementById("main");
		container.className="main-cart-container";

		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		
		var purchaseContainer = document.createElement("div");
		purchaseContainer.setAttribute("id", "purchase-container") 
		var totalPriceContainer = document.createElement("h1");
		var totalPriceTextContainer = document.createTextNode("Total Price: $"+ecommCart.cartTotal());
		totalPriceContainer.appendChild(totalPriceTextContainer);
		purchaseContainer.appendChild(totalPriceContainer);
		totalPriceContainer.setAttribute("id", "total-price");

		var purchaseBtn = document.createElement("button");
		var purchaseBtnText = document.createTextNode("Purchase"); 
		purchaseBtn.setAttribute("id", "purchase-btn"); 
		purchaseBtn.appendChild(purchaseBtnText); 
		purchaseContainer.appendChild(purchaseBtn);
		purchaseBtn.addEventListener("click", function(){
			ecommOrder.renderOrder(self.cartArray);  
		})  

		container.appendChild(purchaseContainer);

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
			quantityInput.setAttribute("id", cartObj.name+"-cart-quantity");

			ecommErrorMessage.errorMessageObj.count = 0; 
		})
	}

	this.modifyInvCount = function modifyInvCount(productObj, quantity){
		var main = document.getElementById("main"); 
		invData.forEach(function (invObj){
			if(invObj.name === productObj.name && main.className==="shop-container"){
				invObj.invCount -= quantity;
				var invCountText = document.getElementById(invObj.name+"-inv-count");
				invCountText.innerHTML="Available: "+invObj.invCount; 
			} else if(invObj.name === productObj.name && main.className==="main-cart-container"){
				invObj.invCount += quantity; 
				console.log(invData); 
			} 
		});
	};

	//From the "Shop" page adds a new item to the user's cart, or updates the item's quantity in the user's cart
	this.addItemToCart = function addItemToCart(itemObj){
		var inputQuantity = document.getElementById(itemObj.name+"-shop-quantity");
		var inputQuantityValue = parseInt(inputQuantity.value);

		if(isNaN(inputQuantityValue) || typeof inputQuantityValue === "string"){ 
			ecommErrorMessage.errorMessageObj.count += 1; 
			inputQuantity.value = ""; 
			return ecommErrorMessage.errorMessage(itemObj)
		}; 
		var itemAlreadyInCart = false;
		//if product is already in user's cart, updates quantity
		self.cartArray.forEach(function (cartObj){
			if(cartObj.name === itemObj.name){ 
				itemAlreadyInCart = true;
				cartObj.quantity += inputQuantityValue;
				self.subtotal(cartObj);
				self.modifyInvCount(cartObj, inputQuantityValue);
				var createConfirmMessage = new ConfirmMessage(itemObj, inputQuantityValue); 
				inputQuantity.value = "";
				if(ecommErrorMessage.errorMessageObj.count === 1){
					ecommErrorMessage.errorMessageObj.count = 0;
					ecommErrorMessage.deleteErrorMessage();
				}
				return;
			};
		});
		//if product is not in user's cart, creates new cartObj and adds to user's cart 
		if(itemAlreadyInCart === false){
			var cartObj = new Product(itemObj.name, itemObj.price, itemObj.img, inputQuantityValue ) 
			self.cartArray.push(cartObj);
			self.subtotal(cartObj);
			self.modifyInvCount(cartObj, inputQuantityValue)
			var createConfirmMessage = new ConfirmMessage(itemObj, inputQuantityValue);
			inputQuantity.value = "";
			if(ecommErrorMessage.errorMessageObj.count === 1){
				ecommErrorMessage.errorMessageObj.count = 0;
				ecommErrorMessage.deleteErrorMessage();	  
			} 
			return;
		};
	};
	//from the "Cart" page, updates the quantity of an item in the user's cart
	this.updateQuantity = function updateQuantity(cartObj){
		var inputQuantityValue = parseInt(document.getElementById(cartObj.name+"-cart-quantity").value);
		if(isNaN(inputQuantityValue) || typeof inputQuantityValue === "string"){ 
			var quantityInput = document.getElementById(cartObj.name+"-cart-quantity");
			quantityInput.value= 0; 
			self.modifyInvCount(cartObj, cartObj.quantity); 
			cartObj.quantity = 0; 
			self.subtotal(cartObj); 
			self.cartTotal(); 
			self.renderCart(); 
			return ecommErrorMessage.cartErrorMessage(cartObj)
		}; 
		self.cartArray.forEach(function (cartItem){
			if(cartItem.name === cartObj.name){
				var cartItemDifference = cartItem.quantity - inputQuantityValue; 
				cartItem.quantity = inputQuantityValue ;
				cartItem.subtotal = self.subtotal(cartItem);
				self.modifyInvCount(cartItem, cartItemDifference); 
			}
		}); 
		self.renderCart();;
	};

	//calculates the subtotal property for each item in user's cart
	this.subtotal = function subtotal(cartObj){ 
		return cartObj.subtotal = cartObj.quantity*cartObj.price;
	};

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
		var cartProductQuantity = self.cartArray[cartItemIndex].quantity; 
		self.modifyInvCount(cartObj, cartProductQuantity); 
		self.cartArray.splice(cartItemIndex, 1);
		self.renderCart();
	};
};

function ConfirmMessage(productObj, quantity){
	var body = document.getElementsByTagName("body")[0];
	var modal = document.createElement("div"); 
	var modalContent = document.createElement("div");
	var textContainer = document.createElement("p"); 
	var text = document.createTextNode("Add "+quantity+" "+productObj.name+" to cart?")
	var confirmBtn = document.createElement("button");
	var confirmBtnText = document.createTextNode("Confirm");
	var cancelBtn = document.createElement("button"); 
	var cancelBtnText = document.createTextNode("Cancel"); 

	body.appendChild(modal).appendChild(modalContent); 
	modalContent.appendChild(textContainer).appendChild(text);
	modalContent.appendChild(confirmBtn).appendChild(confirmBtnText)
	modalContent.appendChild(cancelBtn).appendChild(cancelBtnText);

	modal.setAttribute("id", "modal")
	modalContent.setAttribute("id", "modal-content");
}

function ErrorMessage(){
	var self = this; 
	this.errorMessageObj = {
		count: 0,
		currentParent: "",
	} 

	this.deleteErrorMessage = function deleteErrorMessage(){ 
		var errorMessageParent = document.getElementById(self.errorMessageObj.currentParent); 
		var previousErrorMessage = document.getElementById("error-message"); 
		errorMessageParent.removeChild(previousErrorMessage); 			
	}

	this.errorMessage = function errorMessage(productObj){	 
		if(self.errorMessageObj.count === 2){
			self.deleteErrorMessage(); 

		}
		var productID = document.getElementById(productObj.name); 
		var messageContainer = document.createElement("p");
		var message = document.createTextNode("Not a valid number."); 
		productID.appendChild(messageContainer)
		.appendChild(message); 	

		messageContainer.setAttribute("id", "error-message");
		self.errorMessageObj.count = 1; 
		self.errorMessageObj.currentParent = productObj.name; 	
	}

	this.cartErrorMessage = function cartErrorMessage(itemObj){
		var selectedProductObj; 
		ecommCart.cartArray.forEach(function (cartObj){
			if(cartObj.name === itemObj.name){
				selectedProductObj = cartObj;
			}
		}) 
		selectedProductObj.quantity = 0; 
		ecommCart.subtotal(selectedProductObj); 
		ecommCart.cartTotal();

		var productID = document.getElementById(itemObj.name+"-cart-item"); 
		var messageContainer = document.createElement("p");
		var message = document.createTextNode("Not a valid number.");
		messageContainer.appendChild(message);
		productID.appendChild(messageContainer);	
		messageContainer.className = "cart-error-msg";			 
	}
}

function Order(){
	var self = this;
	this.orderTotal = function orderTotal(cartArray){
		var total = 0; 
		cartArray.forEach(function (cartObj){
			total += cartObj.subtotal;
		});
		return total 
	} 
	this.orderHistory = []; 

	this.renderOrder = function renderOrder(cartArray){
		var main = document.getElementById("main"); 
		while(main.firstChild){
			main.removeChild(main.firstChild); 
		}
		var orderContainer = document.createElement("div"); 
		var orderTextContainer = document.createElement("h1"); 
		var orderText = document.createTextNode("Thank you for your purchase!")
		main.appendChild(orderContainer).appendChild(orderTextContainer).appendChild(orderText);

		cartArray.forEach(function (cartObj){
			var itemRow = document.createElement("div");
			itemRow.className="purchase-item";  
			main.appendChild(itemRow); 

			var productQuantity = document.createElement("h3"); 
			var productQuantityText = document.createTextNode(cartObj.quantity); 
			productQuantity.appendChild(productQuantityText);
			itemRow.appendChild(productQuantity); 

			var productName = document.createElement("h3"); 
			var productNameText = document.createTextNode(cartObj.name); 
			productName.appendChild(productNameText);
			itemRow.appendChild(productName); 

			var productPrice = document.createElement("h3"); 
			var productPriceText = document.createTextNode("$"+cartObj.price.toFixed(2)); 
			productPrice.appendChild(productPriceText);
			itemRow.appendChild(productPrice);

			var productSubtotal = document.createElement("h3"); 
			var productSubtotalText = document.createTextNode("$"+cartObj.subtotal.toFixed(2)); 
			productSubtotal.appendChild(productSubtotalText);
			itemRow.appendChild(productSubtotal); 
		}) 
		var totalTextContainer = document.createElement("h3"); 
		var totalText = document.createTextNode("Total: $"+self.orderTotal(cartArray)); 
		totalTextContainer.appendChild(totalText); 
		main.appendChild(totalTextContainer); 

		self.generateOrder(cartArray)
	}

	this.generateOrder = function generateOrder(cartArray){
		self.orderHistory.push(cartArray); 
		self.clearCart(); 
	}

	this.clearCart = function clearCart(){
		ecommCart.cartArray = []; 
	}
}

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
var ecommOrder = new Order(); 
var ecommErrorMessage = new ErrorMessage(); 


//render "Home" page on load
window.onload = renderHomePage();

