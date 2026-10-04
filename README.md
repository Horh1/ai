<<<<<<< HEAD
# LeadPilot AI — PATCH 03 FIXED

This patch fixes the Supabase RPC error:

`Could not find the function public.create_leadpilot_workspace(...) in the schema cache`

## Important

If you already installed PATCH 03, you do **not** need to recreate the Supabase project.

In Supabase Dashboard → SQL Editor, run this file:

`supabase/migrations/202610020001_leadpilot_workspace_rpc.sql`

Then refresh the LeadPilot page and submit onboarding again.

The migration:
- creates/replaces `public.create_leadpilot_workspace(...)`;
- grants execution to `authenticated`;
- reloads the PostgREST schema cache;
- keeps the operation idempotent: if the authenticated user already belongs to a workspace, the existing organization id is returned.

## Local run

```bash
npm install
npm run dev
```

For production verification:

```bash
npm run build
```
=======
# ai
>>>>>>> 8930816cc901f6d09167d3427aba892f078d5b38
