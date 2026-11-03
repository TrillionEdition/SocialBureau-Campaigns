# SocialBureau Client Workspace

Independent React + Vite application for admin and client workspace UI development. All visible records and analytics are sample data; no real campaign performance is claimed.

## Local development

```powershell
cd campaigns
npm install
npm run dev
```

Vite runs on `http://localhost:5174`. Copy `.env.example` to `.env` to override the API base URL. Do not put credentials or API secrets in `VITE_*` variables.

```powershell
npm run build
npm run preview
```

## Routes

- Admin: `/admin/overview`, `/admin/clients`, `/admin/clients/:clientId`, `/admin/campaigns`, `/admin/plans`, `/admin/team`, `/admin/analytics`, `/admin/notifications`, `/admin/settings`
- Client: `/client/dashboard`, `/client/campaigns`, `/client/campaigns/:campaignId`, `/client/plans`, `/client/updates`, `/client/analytics`, `/client/team`, `/client/support`

## Integration boundary

API request helpers are in `src/services/api.js`. Authentication is intentionally not wired to a login page. Review [INTEGRATION_REPORT.md](./INTEGRATION_REPORT.md) before configuring an auth adapter or connecting sensitive client data. The backend remains responsible for all authorization and account assignment.

Deployment must serve the Vite build with SPA route fallback and HTTPS. The production workspace origin also needs to be approved in backend CORS and, for passkey admin auth, WebAuthn relying-party origin configuration. This project does not modify production or backend settings.
