import { useRef, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";
import creditCard_logo from "@/assets/webp/payment/credit_cards.webp";

const stripePromise = loadStripe(
  "pk_live_51IVTEqF7VIDXrErEBbNfkqFZ1E8OStK6pEJmz63Qdt9Znijv6389LBJpiBX8WsMdbuyP8ug71EjC9j2hufRaGUg700fodfxfZV"
);

const PaymentFormNew = ({ plan }) => {
  const { t } = useTranslation();

  const elementsRef = useRef();
  const formRef = useRef();
  const cardErrorsRef = useRef();
  const stripeRef = useRef();

  useEffect(() => {
    const setupStripe = async () => {
      stripeRef.current = await stripePromise;
      const elements = stripeRef.current.elements();

      const elementStyles = {
        base: {
          color: "#32325d",
          fontFamily: "Arial, sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4",
          },
          iconStyle: "solid",
        },
      };

      const elementClasses = {
        focus: "focus",
        empty: "empty",
        invalid: "invalid",
      };

      elementsRef.current = {
        cardNumber: elements.create("cardNumber", {
          style: elementStyles,
          classes: elementClasses,
          placeholder: t("payment.paymentForm.placeholder.card_number"),
        }),
        cardExpiry: elements.create("cardExpiry", {
          style: elementStyles,
          classes: elementClasses,
          placeholder: t("payment.paymentForm.placeholder.expiration_date"),
        }),
        cardCvc: elements.create("cardCvc", {
          style: elementStyles,
          classes: elementClasses,
          placeholder: t("payment.paymentForm.placeholder.cvv"),
        }),
        postalCode: elements.create("postalCode", {
          style: elementStyles,
          classes: elementClasses,
          placeholder: t("payment.paymentForm.placeholder.postal_code"),
        }),
      };

      elementsRef.current.cardNumber.mount("#cardNumber");
      elementsRef.current.cardExpiry.mount("#cardExpiry");
      elementsRef.current.cardCvc.mount("#cardCvc");
      elementsRef.current.postalCode.mount("#postalCode");

      formRef.current.addEventListener("submit", async (event) => {
        event.preventDefault();

        const { cardNumber } = elementsRef.current;
        const result = await stripeRef.current.createToken(cardNumber);

        if (result.error) {
          cardErrorsRef.current.textContent = result.error.message;
        } else {
          const token = result.token.id;
          const hiddenInput = document.createElement("input");
          hiddenInput.setAttribute("type", "hidden");
          hiddenInput.setAttribute("name", "stripe_token");
          hiddenInput.setAttribute("value", token);
          formRef.current.appendChild(hiddenInput);
          formRef.current.submit();
        }
      });
    };

    setupStripe();
  }, [t]);

  return (
    <form
      action={`${import.meta.env.VITE_API_URL}/subscriptions`}
      method="post"
      id="payment-form"
      ref={formRef}
      className="w-fit"
    >
      <input
        type="text"
        id="plan"
        name="plan"
        defaultValue={plan}
        className="hidden"
      />

      <div className="w-[352px] md:w-[550px] h-[600px] md:h-[520px] px-9 pt-8  border-0.3px border-toggle-color rounded-20px">
        <h2 className="text-black text-xl font-normal pb-6 pl-1">
          {t("payment.paymentForm.title")}
        </h2>
        {/* Card Number */}
        <label
          className="pl-1 text-main-text-gray text-sm2"
          htmlFor="cardNumber"
        >
          {t("payment.paymentForm.fields.card_number")}
        </label>
        <div className="mt-2 py-2.5 px-2 rounded-10px border-0.3px border-toggle-color bg-white">
          <div id="cardNumber"></div> {/* 卡號 */}
        </div>

        <div className="mt-1 w-48 md:w-72">
          <img src={creditCard_logo} alt="" />
        </div>

        <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 justify-between mt-2 mb-5">
          <div className="flex-1 pr-2">
            {/* Expiration Date */}
            <label
              className="pl-1 text-main-text-gray text-sm2"
              htmlFor="cardExpiry"
            >
              {t("payment.paymentForm.fields.expiration_date")}
            </label>
            <div className="mt-2 py-2.5 px-2 rounded-10px border-0.3px border-toggle-color bg-white">
              <div id="cardExpiry"></div> {/* 到期日 */}
            </div>
          </div>

          {/* CVV */}
          <div className="flex-1 pr-2">
            <label
              className="pl-1 text-main-text-gray text-sm2"
              htmlFor="cardCvc"
            >
              {t("payment.paymentForm.fields.cvv")}
            </label>
            <div className="mt-2 py-2.5 px-2 rounded-10px border-0.3px border-toggle-color bg-white">
              <div id="cardCvc"></div> {/* 安全碼 */}
            </div>
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="flex flex-col mb-5 pr-2">
          <label
            className="pl-1 text-main-text-gray text-sm2"
            htmlFor="cardHolderName"
          >
            {t("payment.paymentForm.fields.card_holder_name")}
          </label>
          <input
            type="text"
            placeholder={t("payment.paymentForm.placeholder.card_holder_name")}
            id="cardHolderName"
            className="w-full md:w-1/2 mt-2 py-2.5 px-2 text-payment-text rounded-10px border-0.3px border-toggle-color bg-white focus:ring-0 focus:border-0.3px focus:border-toggle-color placeholder:text-toggle-color"
          ></input>
        </div>

        {/* Postal Code */}
        <div className="flex flex-col pr-2">
          <label
            className="pl-1 text-main-text-gray text-sm2"
            htmlFor="postalCode"
          >
            {t("payment.paymentForm.fields.postal_code")}
          </label>
          <div className="w-full md:w-1/2 mt-2 py-2.5 px-2 rounded-10px border-0.3px border-toggle-color bg-white">
            <div id="postalCode"></div> {/* 郵遞區號 */}
          </div>
        </div>

        <div
          className="h-20 pt-2"
          id="card-errors"
          role="alert"
          ref={cardErrorsRef}
        ></div>
        {/* 錯誤訊息 */}
      </div>

      <div className="w-full flex justify-end mt-7.5">
        <button
          type="submit"
          id="submit-button"
          className=" bg-black hover:bg-main-color text-white py-2.5 px-10 mx-3 rounded-full"
        >
          {t("payment.paymentForm.submit_button")}
        </button>
      </div>
    </form>
  );
};

export default PaymentFormNew;
