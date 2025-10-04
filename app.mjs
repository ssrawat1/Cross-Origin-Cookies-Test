import express from 'express';
import cookieParse from 'cookie-parser';
import { randomBytes } from 'crypto';

const app = express();
const PORT = 4000;
let amount = 10000;

app.use(cookieParse());
app.use(express.urlencoded({ extended: false }));

// Middleware to set CSP
app.use((req, res, next) => {
  if (req.headers.accept?.includes('text/html')) {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self';\
       frame-ancestors 'none'`
    );
  }
  next();
});

// Serve dynamic HTML
app.get('/', (req, res) => {
  if (!req.cookies.sid) {
    return res.send('You are not logged <br> <a href="/login">Login</a>');
  }
  const csrfToken = randomBytes(16).toString('hex');
  res.cookie('csrfToken', csrfToken, { httpOnly: true, sameSite: 'none', secure: true });
  console.log({ csrfToken });
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bank App</title>
      <meta charset="UTF-8" />
    </head>
    <body>
      <h1>Amount: ₹<span id="amount">${amount}</span></h1>
      <form method="POST" action="/pay">
        <input type="text" name="csrfToken" value="${csrfToken}" hidden>
        <button type="submit">Pay</button>
      </form>
    </body>
    </html>
  `);
});

// Handle payment
app.post('/pay', (req, res) => {
  console.log(req.body);
  if (!req.cookies.sid) {
    return res.send('You are not logged.');
  }
  if (req.body.csrfToken !== req.cookies.csrfToken) {
    return res.send('Invalid CSRF Token.');
  }
  amount = 0;
  res.redirect('/');
});

app.get('/login', (req, res) => {
  const sid = crypto.randomUUID();
  res.cookie('sid', sid, { sameSite: 'none', httpOnly: true, secure: true });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
