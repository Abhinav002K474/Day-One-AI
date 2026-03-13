# Profile Name Display Fix

## Objective
Ensure the user's full name is consistently displayed across the application, replacing any hardcoded values (like "Abi").

## Changes Implemented

1.  **Global User Helper**:
    *   Added `getLoggedInUser()` function in `index.html` as the single source of truth for user data from `localStorage`.

2.  **Dashboard Header**:
    *   Updated `updateDashboardData()` to use `getLoggedInUser()` for the greeting message.
    *   Changed header greeting ID to `welcomeText`.

3.  **Profile Dropdown**:
    *   Updated `updateDashboardData()` to populate the profile dropdown name using `getLoggedInUser()`.
    *   Replaced hardcoded "Abi" HTML with dynamic `id="profileName"`.

4.  **View Profile Page**:
    *   Updated `renderProfile()` to fetch user data via `getLoggedInUser()`.
    *   Added `id="profileFullName"` and `id="profileClass"` to the HTML.
    *   Removed hardcoded name and class in the profile HTML section.

5.  **Authentication**:
    *   Updated `handleLogin` to explicitly store `fullName` in `localStorage.user`.

## Verification
*   **Refresh**: Hard refresh the page to see changes.
*   **Console**: Run `JSON.parse(localStorage.getItem("user")).fullName` to verify stored name.
*   **UI**: "Abi" should no longer appear; "Student" or the logged-in name "Ravikumar" will be shown.
