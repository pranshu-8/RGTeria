const placeOrder= require("./apiService");


async function initStripe() {
  let card = null;

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }

  // Ajax call
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }
        placeOrder(formObject);
        return;
      
    });
  }
}
module.exports= initStripe