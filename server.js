require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

app.post("/api/paystack/initialize", async (req, res) => {
  try {
    if (!PAYSTACK_SECRET_KEY || !PAYSTACK_SECRET_KEY.startsWith("sk_test_")) {
      return res.status(500).json({ message: "Add your Paystack TEST secret key to the server environment first." });
    }

    const { email, amount, itemName } = req.body;
    const numericAmount = Number(amount);

    if (!email || !Number.isFinite(numericAmount) || numericAmount < 100) {
      return res.status(400).json({ message: "Enter a valid email and amount (minimum ₦100)." });
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        amount: Math.round(numericAmount * 100),
        currency: "NGN",
        callback_url: `${req.protocol}://${req.get("host")}/payment-callback`,
        metadata: { item_name: String(itemName || "Uwakitech order").slice(0, 100) }
      })
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      return res.status(400).json({ message: data.message || "Could not initialize payment." });
    }

    res.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    res.status(500).json({ message: "Payment service is temporarily unavailable." });
  }
});

app.get("/api/paystack/verify/:reference", async (req, res) => {
  try {
    if (!PAYSTACK_SECRET_KEY || !PAYSTACK_SECRET_KEY.startsWith("sk_test_")) {
      return res.status(500).json({ message: "Paystack test secret key is not configured." });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(req.params.reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
    });
    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(400).json({ message: data.message || "Unable to verify payment." });
    }

    const transaction = data.data;
    res.json({
      status: transaction.status,
      reference: transaction.reference,
      amount: transaction.amount / 100,
      currency: transaction.currency,
      paid: transaction.status === "success"
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    res.status(500).json({ message: "Could not verify payment." });
  }
});

app.get("/payment-callback", (req, res) => {
  const reference = req.query.reference;
  if (!reference) return res.redirect("/?payment=missing-reference");
  res.redirect(`/payment-result.html?reference=${encodeURIComponent(reference)}`);
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Uwakitech website running on port ${port}`));
