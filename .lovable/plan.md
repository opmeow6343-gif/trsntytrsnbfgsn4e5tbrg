

## Plan: Website Improvements

### 1. Floating "My Orders" Button
Add a fixed circular button on the right side of the screen (visible only when logged in) that navigates to `/profile`. Positioned mid-right as a floating action button with an icon.

### 2. Optimize Ticket Deletion (Make Instant)
**Problem**: Deleting tickets is slow because it does sequential awaits and then reloads all tickets.
**Fix**:
- Use optimistic UI updates — remove the ticket from state immediately, then delete in background
- For bulk delete, use `Promise.all` instead of sequential loop
- Remove the `await loadTickets()` after delete since we already updated state optimistically

### 3. Delete All Old Tickets
Use the database insert tool to delete all existing tickets and their messages.

### 4. Full-Screen Chat Dialog
Expand `OrderChatDialog` to be full-screen instead of a small dialog:
- Change `max-w-lg` to `max-w-4xl` and `max-h-[80vh]` to `h-[90vh]`
- Make chat area fill available space
- Also expand admin ticket chat from `320px` height to fill the card

### 5. Admin Panel Navigation Fix
**Problem**: Back button in admin panel goes to `/` (home). 
**Fix**:
- In `AdminSettings.tsx`: Change back button `<Link to="/">` to just show "Go to Website" and add it separately; keep main flow within admin
- Add a "Go to Admin" link in the main website Navbar (visible only to admins)
- In admin nav: Back arrow goes nowhere (already on main admin); add "Visit Website" button

### 6. Speed Optimizations
- Remove the fake `LoadingScreen` — it artificially delays page load by ~1.5s with a progress bar
- Use `React.lazy` + `Suspense` for route-level code splitting
- Remove heavy `AnimatePresence mode="wait"` wrapper on routes (causes layout shifts and delays)

### Technical Changes

**Files to modify:**
1. **`src/App.tsx`** — Remove `LoadingScreen`, add `React.lazy` imports, remove artificial loading gate
2. **`src/components/Navbar.tsx`** — Add floating "My Orders" circle button + admin link for admin users
3. **`src/components/admin/AdminTickets.tsx`** — Optimistic deletes with `Promise.all`, remove reload after delete
4. **`src/components/OrderChatDialog.tsx`** — Make full-screen
5. **`src/pages/AdminSettings.tsx`** — Fix back button nav, add "Visit Website" button

**New file:**
6. **`src/components/FloatingOrdersButton.tsx`** — Circular floating button on right side

**Database operation:**
7. Delete all existing tickets and messages

