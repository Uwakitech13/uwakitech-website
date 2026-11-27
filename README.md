# Uwakitech website

A responsive Uwakitech business website starter with a Node.js/Express backend and Paystack TEST-mode payment endpoints.

## Run locally

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`.
3. Put your Paystack **test secret key** in `.env` as `PAYSTACK_SECRET_KEY`.
4. Run `npm install`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

## Important security notes

- Never put the Paystack secret key in `public/`, HTML, CSS, JavaScript, GitHub, or a screenshot.
- Keep `.env` private. It is excluded by `.gitignore`.
- The server intentionally accepts only a key beginning with `sk_test_`.
- This starter verifies a transaction with Paystack after the customer returns. Before taking real orders, add persistent order storage, server-side order amount validation, webhook signature validation, and production deployment configuration.
- Do not switch to a live key until the complete checkout and order workflow has been tested.

## Customize before launch

- Update the WhatsApp number in `public/app.js`.
- Add real product names, photos, prices and service pricing.
- Update the About section with the business's approved details.
