const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const ACCOUNTS = [
  { user: "official.zmarketing@gmail.com", pass: "zhdf nyoe ktwr ekgq" },
  { user: "infozeta.digitalmarketing@gmail.com", pass: "jjld jrrl pxbj muwn" },
];

const transporters = ACCOUNTS.map(acc => nodemailer.createTransport({ service: "gmail", auth: { user: acc.user, pass: acc.pass } }));
let idx = 0;

app.get("/", (req, res) => res.json({ status: "Obsidian backend online" }));

app.post("/send", async (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) return res.status(400).json({ success: false, error: "Missing fields" });
  const i = idx++ % 2;
  try {
    await transporters[i].sendMail({ from: `"Daniel | Obsidian" <${ACCOUNTS[i].user}>`, to, subject, text: body });
    res.json({ success: true, sentFrom: ACCOUNTS[i].user });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post("/report", async (req, res) => {
  const { subject, body } = req.body;
  try {
    await transporters[0].sendMail({ from: `"Obsidian Engine" <${ACCOUNTS[0].user}>`, to: "harshdeepsinghgill436@gmail.com", subject, text: body });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
