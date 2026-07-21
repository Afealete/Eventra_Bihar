# Admin SDK Setup & Assigning Admin Claims

This file explains how to configure the Firebase Admin SDK locally and how to run the helper script `src/scripts/set-admin-claim.js` to assign the `admin` custom claim to a user.

Prerequisites

- Node.js installed (v14+ recommended)
- A Firebase service account (JSON) or the three environment variables below

Environment variables

You need to provide these three environment variables to initialize the Admin SDK when running the script locally:

- `FIREBASE_PROJECT_ID` — your Firebase project ID
- `FIREBASE_CLIENT_EMAIL` — the client_email field from the service account
- `FIREBASE_PRIVATE_KEY` — the private_key field from the service account

Recommended: create a `.env.local` in the project root (this file is gitignored by default). Example `.env.local`:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

Windows PowerShell notes

- When copying the `private_key` into an environment variable on Windows, ensure newlines are preserved as `\n`. Many service-account JSONs contain real newlines; replace them with `\n` when putting into `.env.local` or an env var value.
- To set env vars for the current user persistently from PowerShell (you'll need to restart your shell):

```powershell
setx FIREBASE_PROJECT_ID "your-project-id" ; setx FIREBASE_CLIENT_EMAIL "your-client-email@..." ; setx FIREBASE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Running the script

From the repository root run (no extra deps required beyond `firebase-admin`):

```powershell
# install firebase-admin if you haven't already
npm install firebase-admin

# then run the script with the user's email
node src/scripts/set-admin-claim.js user@example.com
```

What the script does

- The script initializes the Admin SDK using the three env vars above (it converts `\\n` sequences back into real newlines for the private key) and then looks up the user by email and sets `customClaims.admin = true` for that user.

Afterwards

- Use the Firebase Console or your app to confirm the user now has admin privileges (the Auth token will include the `admin` claim after the user signs in again and refreshes their ID token).

Admin local credentials for the quick admin UI

- This repository includes a simple cookie-based admin login used by the local admin UI. The default credentials are documented in `.env.example` but the app reads runtime values from a `.env.local` file (or environment variables) when running locally.
- Create a `.env.local` at the project root with these entries to enable the local admin login (example values shown):

```
ADMIN_EMAIL=admin@eventra.com
ADMIN_PASSWORD=admin123
ADMIN_COOKIE_SECRET=<paste-a-strong-random-hex-or-base64-secret-here>
```

- To generate a strong secret on Windows PowerShell run from the project root:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- Restart the dev server after creating `.env.local` so Next.js picks up the new env values.

- Note: `.env.example` is only a template and is not automatically loaded by Next.js. Copy its values into `.env.local` (or set the environment variables in your hosting environment) to activate them.
