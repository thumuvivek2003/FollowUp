# Batch Follow-up

A fast, local-first tracker for following up with your batch:
**open → Call / WhatsApp / Message → note → check → next.**

No login, no backend. Your list lives in this browser's `localStorage`.
Use **⋮ → Export backup** now and then, because clearing browser data or switching devices loses the list.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Every push to `main` builds the app and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`).

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Structure

```
src/
  components/ui/          Reusable primitives: Modal, Menu, ConfirmDialog, Checkbox
  context/                ToastContext (toasts with Undo)
  hooks/                  useTheme, useDismiss
  lib/                    storage (localStorage wrapper), phone (links & formatting), id, cn
  features/people/
    types.ts              Person, Filter, Counts
    peopleReducer.ts      All state changes as pure actions
    PeopleContext.tsx     Provider + usePeople / usePeopleActions (state & actions split)
    selectors.ts          Counts, filter + search
    serialization.ts      Validation, export/import JSON
    PeoplePage.tsx        Screen composition + overlay state
    components/           Header, Toolbar, FilterTabs, BulkBar, PersonCard, ...
```

Phone numbers without a country code are treated as Indian (+91).
To change that, edit `DEFAULT_COUNTRY_CODE` in `src/lib/phone.ts`.
