/* 
done by end of week 2/23 

On cart page, when cart has items in it
fix total price position, check small screen and large screen


do you have to use as many ids and classes? Can you use "this" when trying to manipulate an element?

redo naming conventions, make sure var names make sense

order confirmation is a modal 
--modify text so that it's more clear

*/
//Data for name and price of store products
var invData = [
{name: "Avocado", price: 3.10, img: "./assets/avocado.jpg", invCount: 100},
{name: "Banana", price: .99, img: "./assets/banana.jpg", invCount: 100},
{name: "Cherries", price: 1.50, img: "./assets/cherries.jpg", invCount: 100},
{name: "Kiwi", price: 2.50, img: "./assets/kiwi.jpg", invCount: 100},
{name: "Papaya", price: 2.75, img: "./assets/papaya.jpg", invCount: 100},
{name: "Strawberries", price: 1.99, img: "./assets/strawberries.jpg", invCount: 100},
]

function Product(name, price, img, quantity){
	this.name = name;
	this.price = price;
	this.img = img;
	this.quantity = quantity;
}

//renders the "Home" page when user clicks on "Home"
function HomePage(){
	var self = this; 
	document.getElementById("home").addEventListener("click", function(){
		self.renderHomePage(); 		
	});

	this.renderHomePage = function renderHomePage(){	
		var main = document.getElementById("main");
		main.className = "home-page"; 

		while (main.firstChild) {
			main.removeChild(main.firstChild);
		}
		main.classList.remove("shop-container")

		var greetingContainer = document.createElement("h1");
		var greetingText = document.createTextNode("Welcome to the Produce Emporium!");

		main.appendChild(greetingContainer).appendChild(greetingText);

		invData.forEach(function (invObj){
			var img = document.createElement("img"); 
			main.appendChild(img);

			img.setAttribute("src", invObj.img )
			img.className="product-img"
		});
		greetingContainer.className="greeting"

		self.showSlides(); 
	}

	this.showSlides = function showSlides(){
		var slideIndex = 0;
		var slides = document.getElementsByClassName("product-img"); 

		playShow(); 

		function playShow(){
			if(main.className === "home-page"){
				var slideArray = Array.prototype.slice.call(slides)
				slideArray.forEach(function (slide){
					slide.style.display = "none"; 
				});
				slideIndex++;
				if(slideIndex > slides.length){
					slideIndex=1; 
				} 
				slides[slideIndex-1].style.display = "block";
				setTimeout(playShow, 3000);		
			}				
		}
	}

	// self.stopSlideShow = function (){
	// 	clearTimeOut(); 
	// }
}

//Object constructor for store products
function Shop(invData){
	var self = this; 

	document.getElementById("shop").addEventListener("click", function(){
		self.renderShop(); 		
	}); 

	this.renderShop = function renderShop(){ 
		var container = document.getElementById("main");
		main.className = "shop"; 
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		container.className="shop-container";


		invData.forEach(function (itemObj){ 
			var productContainer = document.createElement("div");	
			var productNameTextContainer = document.createElement("h1");	
			var productNameText = document.createTextNode(itemObj.name); 
			
			var productImg = document.createElement("img");
			
			var priceContainer = document.createElement("p");
			var price = itemObj.price;
			var priceText = document.createTextNode("Price: $"+price.toFixed(2)+"") 
			
			var quantityTextContainer = document.createElement("p");
			var quantityText = document.createTextNode("Quantity: ");

			var quantityForm = document.createElement("form");
			var select = document.createElement("select");
			select.className = "select-quantity"
			select.setAttribute("id", itemObj.name+"-select-quantity"); 

			var lineBreak = document.createElement("br"); 
			var submit = document.createElement("input");
			submit.addEventListener("click", function(){
				event.preventDefault(); 
				var quantity = parseInt(select.value); 
				ecommCart.addItemToCart(itemObj, quantity); 
				document.getElementById(itemObj.name+"-select-quantity").selectedIndex=0; 
			});

			for(i=0; i<=10; i++){		
				var option = document.createElement("option") 
				var optionText = document.createTextNode(i);
				option.setAttribute("value", i);
				select.appendChild(option).appendChild(optionText); 	
			}

			var addToCartBtn = document.createElement("button");
			var addToCartTxt = document.createTextNode("Add to Cart");
			var inventoryTextContainer = document.createElement("p"); 
			var inventoryText = document.createTextNode("Available: "+itemObj.invCount);
			
			productContainer.setAttribute("id", itemObj.name);
			productImg.setAttribute("src", itemObj.img);
			addToCartBtn.setAttribute("id", itemObj.name+"-add-btn");
			select.setAttribute("name", "product");
			inventoryTextContainer.setAttribute("id", itemObj.name+"-inv-count");
			submit.setAttribute("type", "submit"); 
			submit.setAttribute("value", "Add to Cart");	

			productNameTextContainer.className="product-name";
			productImg.className="product-img";
			priceContainer.className="product-price";
			quantityTextContainer.className = "quantity"
			productContainer.className="product";
			quantityForm.className="quantity-form"
			
			container.appendChild(productContainer).appendChild(productNameTextContainer).appendChild(productNameText);
			productContainer.appendChild(productImg);
			productContainer.appendChild(priceContainer).appendChild(priceText);

			productContainer.appendChild(quantityTextContainer).appendChild(quantityText);

			productContainer.appendChild(quantityForm); 
			quantityForm.appendChild(select);
			quantityForm.appendChild(lineBreak); 
			quantityForm.appendChild(submit); 
		
			inventoryTextContainer.appendChild(inventoryText); 
			productContainer.appendChild(inventoryTextContainer);

		});
	};
};

//object constructor for cart
function Cart(){
	var self = this;
	var main = document.getElementById("main");
	//an array of product objects in the user's cart
	this.cartArray = [];

	//renders "Cart" page when user clicks on "Cart"
	document.getElementById("cart").addEventListener("click", function(){
		self.renderCart(); 			
	}); 

	self.renderCart = function renderCart(){ 
		main.classList.remove("shop-container")

		while (main.firstChild) {
			main.removeChild(main.firstChild);
		}

		if(ecommCart.cartArray.length === 0){
			emptyCartMessage(); 
		}
		
		var purchaseContainer = document.createElement("div");	
		var cartContainer = document.createElement("div");  
		var totalPriceContainer = document.createElement("h1");
		var totalPriceTextContainer = document.createTextNode("Total Price: $"+ecommCart.cartTotal());
		
		var purchaseBtn = document.createElement("button");
		var purchaseBtnText = document.createTextNode("Purchase"); 
		 
		purchaseBtn.addEventListener("click", function(){
			ecommOrder.renderOrder(self.cartArray);  
		}); 

		cartContainer.className="cart-container";

		main.appendChild(purchaseContainer);
		main.appendChild(cartContainer);

		

		(ecommCart.cartArray).forEach(function (cartObj){
			var cartItemContainer = document.createElement("div");
			var cartObjImg = document.createElement("img");
			var cartObjNameContainer = document.createElement("h1");
			cartObjImg.setAttribute("src", cartObj.img);

			var cartObjName = document.createTextNode(cartObj.name);
			
			var cartInfoContainer = document.createElement("div");
			cartInfoContainer.className="cart-info-container";

			var quantityForm = document.createElement("form");

			var select = document.createElement("select");  

			for(i=0; i<=10; i++){		
				var option = document.createElement("option") 
				var optionText = document.createTextNode(i);
				option.setAttribute("value", i);
				select.appendChild(option).appendChild(optionText); 	
			};

			select.value = cartObj.quantity; 
			select.addEventListener("change", function(){
				self.updateQuantity(cartObj, select.value); 
				this.selectedIndex=0;  

			});

			var subtotalTextContainer = document.createElement("p");
			var subtotalText = document.createTextNode("Subtotal: $"+cartObj.subtotal);
			
			var removeButton = document.createElement("button");
			var removeButtonText = document.createTextNode("Remove");
			removeButton.className = "remove-btn";
			select.className="cart-select";
			removeButton.appendChild(removeButtonText);
			removeButton.addEventListener("click", function(){
				ecommCart.removeFromCart(cartObj);
			});

			cartObjNameContainer.className="product-name"; 
			purchaseContainer.setAttribute("id", "purchase-container");
			cartItemContainer.className = "cart-item-container";
			cartInfoContainer.setAttribute("id", cartObj.name+"-cart-item");
			select.className = "select-quantity"; 
			subtotalTextContainer.setAttribute("id", cartObj.name+"-subtotal");
			totalPriceContainer.setAttribute("id", "total-price");
			removeButton.setAttribute("id", cartObj.name+"-remove-btn");
			purchaseBtn.setAttribute("id", "purchase-btn");
			cartObjImg.className="product-img";

			totalPriceContainer.appendChild(totalPriceTextContainer);
			purchaseContainer.appendChild(totalPriceContainer);

			purchaseBtn.appendChild(purchaseBtnText); 
			purchaseContainer.appendChild(purchaseBtn);
			

			cartContainer.appendChild(cartItemContainer);
			
			cartItemContainer.appendChild(cartInfoContainer);
			cartItemContainer.appendChild(removeButton);

			cartInfoContainer.appendChild(cartObjNameContainer).appendChild(cartObjName);
			cartInfoContainer.appendChild(cartObjImg);	

			subtotalTextContainer.appendChild(subtotalText);

			cartInfoContainer.appendChild(quantityForm); 
			quantityForm.appendChild(select);

			cartInfoContainer.appendChild(subtotalTextContainer);
		});
	};

	function emptyCartMessage(){
		var textContainer = document.createElement("h1"); 
		var text = document.createTextNode("Your cart is empty"); 

		textContainer.className = "empty-cart-msg";

		main.appendChild(textContainer);
		textContainer.appendChild(text);
	}

	//From "Shop" page adds new item user's cart, or updates item's quantity
	this.addItemToCart = function addItemToCart(itemObj, quantity){
		var main = document.getElementById("main"); 
		var itemAlreadyInCart = false; 
		ecommCart.cartArray.forEach(function (cartObj){
			if(cartObj.name === itemObj.name){
				itemAlreadyInCart = true; 
				cartObj.quantity += quantity; 
				ecommCart.subtotal(cartObj);
				return self.modifyInvCount(itemObj, quantity)
			};
		});

		//if product is not in user's cart, creates new cartObj and adds to user's cart 
		if(itemAlreadyInCart === false){
			var cartObj = new Product(itemObj.name, itemObj.price, itemObj.img, quantity ) 
			ecommCart.cartArray.push(cartObj);
			ecommCart.subtotal(cartObj);
			ecommCart.modifyInvCount(cartObj, quantity)
			return;
		};

		if(main.classList.contains("cart-container")){
			ecommCart.renderCart()
		}
	};

	this.modifyInvCount = function modifyInvCount(productObj, quantity){
		var main = document.getElementById("main"); 
		invData.forEach(function (invObj){
			if(invObj.name === productObj.name && main.className==="shop-container"){
				invObj.invCount -= quantity;
				var invCountText = document.getElementById(invObj.name+"-inv-count");
				invCountText.innerHTML="Available: "+invObj.invCount; 
			} 
			//updates available quantity on cart page 
			else if(invObj.name === productObj.name && main.className==="cart-container"){
				invObj.invCount += quantity; 
			} 
		});
	};

	//from the "Cart" page, updates the quantity of an item in the user's cart
	this.updateQuantity = function updateQuantity(cartObj, input){
		var inputNum = parseInt(input); 

		self.cartArray.forEach(function (cartItem){
			if(cartItem.name === cartObj.name){
				var cartItemDifference = cartItem.quantity - inputNum; 
				cartItem.quantity = inputNum;
				self.subtotal(cartItem);
				self.modifyInvCount(cartItem, cartItemDifference); 
			}
		}); 
		ecommCart.renderCart();;
	};
	//calculates the subtotal property for each item in user's cart
	this.subtotal = function subtotal(cartObj){
		cartObj.subtotal = parseFloat(cartObj.quantity*cartObj.price).toFixed(2);
	}

	//adds subtotals together to calculate total price
	this.cartTotal = function cartTotal(){ 
		var totalPrice = 0;
		ecommCart.cartArray.forEach(function (cartObj){
			totalPrice += parseFloat(cartObj.subtotal); 
		});
		return totalPrice.toFixed(2)
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


function Order(){
	var self = this;
	this.orderTotal = function orderTotal(cartArray){
		var total = 0; 
		cartArray.forEach(function (cartObj){
			total += parseFloat(cartObj.subtotal); 
		});
		return total.toFixed(2)
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
		
		var totalTextContainer = document.createElement("h3"); 
		var totalText = document.createTextNode("Total: $"+self.orderTotal(cartArray)); 
		 

		main.appendChild(orderContainer).appendChild(orderTextContainer).appendChild(orderText);
		main.appendChild(totalTextContainer).appendChild(totalText); 

		cartArray.forEach(function (cartObj){
			var itemRow = document.createElement("div");
			itemRow.className="purchase-item";  	 

			var productQuantity = document.createElement("h3"); 
			var productQuantityText = document.createTextNode(cartObj.quantity); 

			var productName = document.createElement("h3");
			var productNameText = document.createTextNode(cartObj.name);			
			 
			var productPrice = document.createElement("h3"); 
			var productPriceText = document.createTextNode("@$"+cartObj.price.toFixed(2)); 

			var productSubtotal = document.createElement("h3"); 
			var productSubtotalText = document.createTextNode("$"+cartObj.subtotal); 

			orderContainer.appendChild(itemRow);
			productQuantity.appendChild(productQuantityText);
			itemRow.appendChild(productQuantity); 
			productName.appendChild(productNameText);
			itemRow.appendChild(productName); 
			productPrice.appendChild(productPriceText);
			itemRow.appendChild(productPrice);
			productSubtotal.appendChild(productSubtotalText);
			itemRow.appendChild(productSubtotal); 

		}) 

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


//calls render function on array of inventory objects

var ecommCart = new Cart();
var ecommShop = new Shop(invData); 
var ecommOrder = new Order();  
var ecommHomePage = new HomePage(); 


//render "Home" page on load
window.onload = ecommHomePage.renderHomePage();

