# Login Authentication System

A full-stack authentication system built with Node.js and Express.
Users can register, log in, view a protected dashboard and log out.

## Features
- Registration with validation (min 8 characters, at least 1 number)
- Duplicate username check (case-insensitive)
- Login with a generic error message ("Invalid username or password")
  that never reveals which field was wrong
- Protected /dashboard route: redirects to login without a session
- Logout that destroys the session
- Passwords hashed with bcrypt, never stored in plain text
- Validation on both the browser and the server

## Tech Stack
Node.js, Express, express-session, bcryptjs, HTML/CSS/JavaScript,
JSON file storage

## How to Run
1. Install Node.js (LTS)
2. Clone the repo and open the WebDev-L2-LoginAuth folder
3. `npm install`
4. `npm start` (or `node server.js`)
5. Open http://localhost:3000

The `data/users.json` file is created automatically on the first
registration and is excluded from Git on purpose.

## Security Notes
- **Passwords:** hashed with bcrypt (10 salt rounds). Each hash has its
  own random salt, so identical passwords produce different hashes.
- **Sessions:** the session ID is stored in an HttpOnly cookie, so
  JavaScript in the page cannot read it. The session is regenerated at
  login to prevent session fixation.
- **Server-side validation:** the browser can be bypassed, so the server
  re-checks every input.
- **Protected page:** dashboard.html lives outside the public folder and
  is only served by a route that checks the session.

## Known Limitations (this is a learning project)
- The session secret falls back to a hardcoded value. In production it
  must be set via the SESSION_SECRET environment variable.
- The cookie does not use `secure: true` because this runs on HTTP
  locally. Production needs HTTPS.
- No rate limiting, so brute-force login attempts are not blocked.
- No CSRF protection.
- Users are stored in a JSON file, which does not handle concurrent
  writes. A real app would use a database.
