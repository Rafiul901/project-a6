import Stripe from "stripe";
import config from "../config/index.js";

const stripe = new Stripe(config.stripe.secretKey);

export default stripe;