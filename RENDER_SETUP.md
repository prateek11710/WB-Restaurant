# Render setup

Use this if you want the fastest path to make the checkout and WhatsApp flow work live.

## What to deploy

- Front end: GitHub Pages
- Backend: Render

## Render values

Create a new Render Blueprint deployment from this repo. The included `render.yaml` already sets most values.

You only need to fill these secret values in Render:

- `WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id`
- `WHATSAPP_ACCESS_TOKEN=your_meta_whatsapp_access_token`

These values are already set for you in `render.yaml`:

- `NODE_VERSION=18`
- `PORT=3000`
- `CORS_ORIGIN=https://prateek11710.github.io,http://localhost:3000`
- `WHATSAPP_API_VERSION=v22.0`
- `WHATSAPP_OWNER_NUMBER=919105624475`

## After Render deploys

1. Copy your live Render backend URL

   Example:

   ```txt
   https://wb-restaurant-backend.onrender.com
   ```

2. Open `config.js`
3. Replace the line with your real backend URL:

   ```js
   window.SC_API_BASE_URL = "https://wb-restaurant-backend.onrender.com";
   ```

4. Commit and push `config.js`
5. Let GitHub Pages republish the front end

## Quick test

1. Open:

   ```txt
   https://your-render-url.onrender.com/api/health
   ```

2. Confirm you get JSON with `"ok": true`
3. Open your site on GitHub Pages
4. Place a test order
5. Verify:

   - owner gets WhatsApp notification
   - customer gets WhatsApp invoice message
   - success modal shows a real order ID

## Important

- The customer WhatsApp number must be in a format the Meta WhatsApp API accepts.
- If Meta Cloud API is still in test mode, only approved/test recipient numbers may receive messages.
