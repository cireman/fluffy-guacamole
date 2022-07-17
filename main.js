import { data } from "./js/data.js";

const containerCloths = document.querySelector(".clothes__container");
const shoppingBag = document.querySelector(".shopping-bag");
const containerShopping = document.querySelector(".container__shopping");
const contentShopping = document.querySelector(".content_shopping");
const shoppingTotal = document.querySelector(".shoppingTotal");
const btnBuy = document.querySelector("#btnBuy");
const bagCounter = document.querySelector(".bag__counter");


let shoppingObj = {};

contentShopping.addEventListener("click", (event) => {
  if (event.target.classList.contains("rest")) {
    const id = parseInt(event.target.parentElement.id);

    if (shoppingObj[id].amount === 1) {
      const res = confirm("seguro quieres eliminar esto?");

      if (res) {
        delete shoppingObj[id];
      }
    } else {
      shoppingObj[id].amount--;
    }
  }

  if (event.target.classList.contains("add")) {
    const id = parseInt(event.target.parentElement.id);

    if (shoppingObj[id].stock > shoppingObj[id].amount) {
      shoppingObj[id].amount++;
    } else {
      alert("No tenemos disnibilidad");
    }
  }

  if (event.target.classList.contains("del")) {
    const id = parseInt(event.target.parentElement.id);

    const res = confirm("seguro quieres eliminar esto?");

    if (res) {
      delete shoppingObj[id];
    }
  }

  amountProductInCart();
  printTotalPrice();
  printShoppingCart();
});

containerCloths.addEventListener("click", (event) => {
  if (event.target.classList.contains("button__add")) {
    const id = parseInt(event.target.parentElement.id);
    console.log(id);
    const [currentProduct] = data.filter((n) => n.id === id);

    if (shoppingObj[id]) {
      if (shoppingObj[id].stock > shoppingObj[id].amount) {
        shoppingObj[id].amount++;
      } else {
        alert("No tenemos disnibilidad");
      }
    } else {
      if (!currentProduct.stock) return alert("No hay en el inventario");
      shoppingObj[id] = currentProduct;
      shoppingObj[id].amount = 1;
    }

    amountProductInCart();
    printTotalPrice();
    printShoppingCart();
  }
});

function amountProductInCart() {
  bagCounter.textContent = Object.values(shoppingObj).length;
}

function printTotalPrice() {
  const shoppingArray = Object.values(shoppingObj);

  let suma = 0;

  shoppingArray.forEach((n) => {
    suma += n.amount * n.price;
  });

  shoppingTotal.textContent = suma;
}

function printShoppingCart() {
  const shoppingArray = Object.values(shoppingObj);

  let html = "";

  shoppingArray.forEach(({ id, name, price, stock, urlImages, amount }) => {
    html += `
            <div class="shopping">
    <div class="shopping__header">
        <div class="shopping__img">
            <img src="${urlImages}" alt="${name}">
        </div>
        <div class="shopping__info">
            <p>Nombre: ${name}</p>
            <p>Precio: ${price}</p>
            <p>Stock: ${stock}</p>
        </div>
    </div>
    <div class="shopping__actions" id="${id}">
        <span class="rest">-</span>
        <b class="amount">${amount}</b>
        <span class="add">+</span>
        <img src="./ecommerce/trash.svg" alt="" class="del">
    </div>
</div>`;
  });

  contentShopping.innerHTML = html;
}

function printclothes(array) {
  let html = "";

  array.forEach(({ id, name, price, stock, urlImages }) => {
    html += `
        <ul class="slider">
    <li id="slide1">
        <div class="slider__element">
            <img src="${urlImages}" alt="">
            <p><span class="partA">&#36;${price} &#124;</span> <span class="partB">Stock: ${stock}</span> <br> <span
                    class="partC">${name}</span></p>
            <div class="button__conten" id="${id}">
                <img src="./ecommerce/plus-circle-regular-24.png" alt="" class="button__add">
            </div>
        </div>
    </li>
</ul>`;
  });

  containerCloths.innerHTML = html;
}

printclothes(data);

shoppingBag.addEventListener("click", () => {
  containerShopping.classList.toggle("show__shopping");
});
shoppingBag.addEventListener("click", () => {
  containerShopping.classList.toggle("close__shopping");
});

btnBuy.addEventListener("click", () => {
  const res = confirm("Desea encargar esta comida?");

  if (res) {
    const shopping = Object.entries(shoppingObj);

    data = data.map((eData) => {
      const productInShopping = shopping.find(
        (product) => parseInt(product[0]) === eData.id
      );

      if (!productInShopping) return eData;

      return {
        ...eData,
        stock: eData.stock - productInShopping[1].amount,
      };
    });

    shoppingObj = {};
    shoppingTotal.textContent = 0;
    bagCounter.textContent = 0;

    printShoppingCart();
    printclothes(data);
  }
});
