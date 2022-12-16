/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51MFJVNBiO9l1RN0qH1r6k4OSHOj3nWIh6WjD53T2D9Uli5dbnmVjYU6pCYOyCIdFpaSdEuK1ZcBmKLsoXKtaYKCr004twqURrx'
);

export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from Api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //2) Create checkout from +charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
