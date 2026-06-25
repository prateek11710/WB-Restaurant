# Spice & Charcoal with WhatsApp backend

This project now includes a real Node/Express backend for checkout orders and WhatsApp notifications.

## What changed

- `server.js`: serves the site and exposes `POST /api/orders`
- `config.js`: lets the GitHub Pages front end point to a deployed backend URL
- `.env.example`: lists the WhatsApp and CORS environment variables you need
- `app.js`: checkout now sends the order to the backend and waits for a real response

## Local run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an env file:

   ```bash
   cp .env.example .env
   ```

3. Fill in your Meta WhatsApp Cloud API values inside `.env`.

4. Start the app:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000`

## GitHub Pages + backend deployment

GitHub Pages can host the front end, but it cannot run `server.js`.

To make checkout work from `https://prateek11710.github.io/WB-Restaurant/`, deploy the backend separately and point `config.js` to it.

### Option 1: Render

This repo now includes `render.yaml`, so Render can deploy it directly.

1. Push this updated repo to GitHub.
2. In Render, create a new Blueprint deployment from the repo.
3. Set these environment variables in Render:

   - `CORS_ORIGIN=https://prateek11710.github.io,http://localhost:3000`
   - `WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id`
   - `WHATSAPP_ACCESS_TOKEN=your_meta_whatsapp_access_token`
   - `WHATSAPP_OWNER_NUMBER=919105624475`

4. Deploy and copy the backend URL, for example:

   ```txt
   https://wb-restaurant-backend.onrender.com
   ```

5. Edit `config.js` and set:

   ```js
   window.SC_API_BASE_URL = "https://your-backend-url.com";
   ```

6. Commit and publish the front end again to GitHub Pages.

### Option 2: Railway

Railway can deploy this repo from `package.json` and the included `Procfile`.

1. Create a new Railway project from this GitHub repo.
2. Add the same environment variables:

   - `CORS_ORIGIN=https://prateek11710.github.io,http://localhost:3000`
   - `WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id`
   - `WHATSAPP_ACCESS_TOKEN=your_meta_whatsapp_access_token`
   - `WHATSAPP_OWNER_NUMBER=919105624475`

3. Railway should detect the app automatically and run `npm start`.
4. Copy the public Railway URL.
5. Put that URL into `config.js`:

   ```js
   window.SC_API_BASE_URL = "https://your-backend-url.com";
   ```

6. Commit and publish the front end again to GitHub Pages.

### Test after deployment

1. Open your deployed backend health endpoint:

   ```txt
   https://your-backend-url.com/api/health
   ```

2. Confirm it returns JSON with `"ok": true`
3. Open your GitHub Pages site and place a test order
4. Check that:

   - the order returns a real order ID
   - the owner receives a WhatsApp alert
   - the customer receives the invoice message on WhatsApp

## Required environment variables

- `PORT`
- `CORS_ORIGIN`
- `WHATSAPP_API_VERSION`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_OWNER_NUMBER`

## Notes

- Owner notifications are sent to `+91 91056 24475` by default.
- Customer invoice messages are sent to the phone number entered at checkout.
- The backend does not send raw card details anywhere. It only records the chosen payment method.
- Use Node `18+` for local and hosted deployments.
