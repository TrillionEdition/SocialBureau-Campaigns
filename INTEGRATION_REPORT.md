# Authentication and API Integration Report

Discovery date: 2026-11-03. This report describes the backend code inspected during setup. It is not approval to change backend configuration or to ship a login flow.

## Authentication findings

- **Identity:** `POST /user/login` is the password-login entry point. Non-admin users receive an email OTP challenge and complete it with `POST /user/login/verify-otp`. `POST /user/google-login` is also present. The admin path requires a passkey after password verification; see below.
- **JWT and request authentication:** requests are resolved by `userAuthentication` and `authCore.resolveIdentity`. The JWT is read from the HttpOnly `token` cookie first, with a Bearer header as a fallback for non-admin users. User ID, role, and `authVersion` are checked against the database on requests. Admin requests do not accept Bearer-token authority.
- **Token response caution:** the inspected login handlers also include a token in some successful JSON responses. Do not copy it into local storage or treat a frontend role check as authorization; agree with the backend owner on the supported cookie-based client contract before integrating.
- **Cookies and sessions:** user login sets an HttpOnly `token` cookie (two-day max age; `Secure` and `SameSite=None` in production, `SameSite=Lax` in development). The app also configures an HttpOnly `sb.sid` Express session cookie backed by MongoDB, but the inspected identity middleware reads the `token` cookie. Admin authentication additionally validates a server-side admin session stored in the database. Admin login's token cookie is HttpOnly, Secure in production, SameSite=None in production, and uses `/` as its path.
- **Admin authentication:** `POST /user/login` returns an MFA challenge for admin accounts, not an authenticated user session. Complete it via `POST /user/admin/mfa/login/options` and `POST /user/admin/mfa/login/verify` with WebAuthn/passkey responses. Enrollment routes are under `/user/admin/mfa/enroll/*`. The authenticated session endpoint is `GET /user/admin/mfa/session`; it returns the current admin user and a CSRF token. Admin unsafe requests require `X-CSRF-Token`, and origin checks use the WebAuthn relying-party origins. Production also requires `WEBAUTHN_RP_ID`.
- **Logout:** `POST /user/logout` requires authentication, increments the user's `authVersion`, clears `token`, and revokes admin sessions when applicable.
- **Password reset:** `POST /user/forgot-password`, `POST /user/verify-otp`, and `POST /user/reset-password` implement an emailed OTP followed by a short-lived reset token. This is separate from the login OTP endpoint.
- **User model:** `User` includes `name`, `email`, required `password`, `role` (default `"user"`), `verification`, `authVersion`, and a `clients` array of `Client` ObjectId references, among other staff/profile fields. The inspected schema does not define a `permissions` field. Do not infer the meaning of `clients` as a safe workspace assignment without a data/API review.
- **Roles and permissions:** the shared admin role check recognizes the `"admin"` role. Some campaign read handlers additionally treat `"partner"` and `"partnership"` as admins, although their route middleware still applies admin authentication. A `checkPermission` middleware exists for explicit permission strings, but the inspected `User` schema does not declare those permissions. Backend authorization must remain authoritative; route visibility in this frontend is not security.
- **Admin auth restrictions:** authenticated admin requests require a live passkey-verified server-side session. Mutating admin requests also require a valid CSRF token; selected sensitive operations require recent re-authentication.

## Existing API surfaces that may be reused

The backend mounts its router at both `/` and `/socialbureau`. With `VITE_API_BASE_URL=https://api.socialbureau.in`, the workspace uses the root-mounted route forms below:

| Purpose | Existing route | Notes |
|---|---|---|
| Admin client records | `GET /clients`, `GET /clients/:id` | Admin-authenticated CRM records. These `Client` records are not yet shown to be the same as campaign-owning client user accounts. |
| Client creation/update | `POST /clients/intake`, `PATCH /clients/:id` | Intake is a public submission; update is admin-authenticated. Not a workspace invite/assignment API. |
| Admin campaign list | `GET /campaigns/admin` | Admin auth, supports search/status/date filters and pagination. |
| Campaign details/update | `GET /campaigns/:bookingId`, `PATCH /campaigns/admin/:bookingId` | Campaign detail has ownership/admin/booking-token checks. Admin update supports status and internal notes; it does not provide client assignment management. |
| Client campaigns | `GET /campaigns/mine` (also `GET /campaigns`) | Returns campaigns owned by the authenticated user ID or matching client email. The implementation does not resolve a separately assigned client account. |
| Campaign analytics | `GET /campaigns/:campaignId/analytics` | Authenticated owner-only view of existing campaign analytics; data may be unavailable/stale. |
| Campaign plans | `GET /campaigns/admin/plans`, `GET /campaigns/pricing` | Admin plan management API exists for campaign plans; public pricing endpoint exposes active pricing/plan configuration. These may not be the same as recurring client subscriptions. |
| Client subscriptions | `GET /api/client-subscriptions/me`, `GET /api/client-subscriptions/admin` | Existing client-own subscription and admin subscription views. |
| Admin client users | `GET /api/client-subscriptions/admin/clients`, `POST /api/client-subscriptions/admin/clients` | Admin-authenticated listing and user creation exist. User creation is not a verified invitation lifecycle or client-account assignment API. |
| User/admin auth | `/user/login`, `/user/login/verify-otp`, `/user/google-login`, `/user/logout`, `/user/admin/mfa/*` | Must be integrated according to the existing user OTP and admin WebAuthn flows, not a new auth system. |

The app's current `src/services/api.js` is only an integration client. Pages intentionally show clearly labeled sample data and do not call these endpoints automatically.

## API work needed before a real workspace

1. Define the authoritative relationship between a client login, a CRM `Client` record, campaign ownership, subscription ownership, and invited users. Do not duplicate those records in a new workspace collection.
2. Provide an admin-safe client workspace endpoint (or documented composition of existing endpoints) that returns only records assigned to the selected client, with backend authorization on every request.
3. Add a backend-enforced campaign assignment operation and audit trail if administrators are expected to assign campaigns to clients. The current campaign update route only updates campaign status and internal notes.
4. Add invitation and account-level membership APIs, including invite lifecycle, revocation, roles, and validation that client users can access only explicitly assigned accounts. Existing CRM intake and team directory endpoints are not equivalent to client workspace invitations.
5. Confirm the subscription model exposed as “plans” and its client ownership semantics before connecting the UI; campaign catalog plans and recurring subscriptions are different surfaces.
6. Confirm a supported client session/current-user endpoint. The inspected user routes do not expose a generic current-user endpoint; `GET /user/admin/mfa/session` is admin-specific.

No backend files were changed. The required work above needs a separate reviewed and approved backend task.

## CORS, cookies, and deployment prerequisites

- Existing backend CORS allows `http://localhost:5174` and credentialed requests, but does **not** currently list `https://workspace.socialbureau.in`. Production deployment requires an approved backend CORS allowlist update; do not broaden the allowlist to `*` when credentials are enabled.
- Production responses must allow credentials and the workspace origin exactly. Configure preflight methods/headers for the existing API needs, including `Content-Type`, `X-CSRF-Token`, and any future approved headers.
- The frontend Axios client uses `withCredentials: true` so the browser may send backend cookies. It never reads or stores the HttpOnly token. Cross-origin cookie use requires HTTPS and correct credentialed CORS behavior.
- The admin passkey ceremony checks the browser origin against `WEBAUTHN_ORIGINS` (or its existing defaults) and requires a production `WEBAUTHN_RP_ID`. The new workspace origin and relying-party configuration must be reviewed together; no environment values are changed here.
- Host the `campaigns/dist` build at `workspace.socialbureau.in` over HTTPS and configure the host to serve `index.html` for SPA route fallbacks. API secrets, signing keys, OAuth client secrets, and Mongo credentials must remain server-side.

## Frontend auth integration boundary

`src/services/authService.js` provides an injectable adapter boundary and intentionally rejects login until an approved adapter is supplied. Its optional `createAdminCookieAuthAdapter` is limited to the discovered admin session/CSRF/logout endpoints and does not implement login or establish client sessions. The backend login is not a simple username/password exchange: user accounts require an email OTP and administrator accounts require WebAuthn/passkeys plus CSRF handling. Review this report and agree the cross-origin, session, and browser-credential behavior before implementing or enabling login.
