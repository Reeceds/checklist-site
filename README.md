## App versions

Angular CLI: 19.0.0
Node: 22.17.1
Package Manager: npm 10.9.2

## Technical applications

-   @Output() and EventEmitter which allows a reusable child component to submit and input value and retrieve this on the parent component
-   Toastr service to display alerts when e.g. data is sumitted successfully or alert an error.
-   EventTriggerService. This allows one component to trigger an action in a different unrelated (none parent/child) component.
-   Google OAuth (authentication).
-   JWT interceptor for access/refresh tokens.
-   CanComponentDeactivate routeguard which is triggered when a user attempts to navigate to a different route without saving checklist item changes. Includes files: can-component-deactivate.interface.ts, pending-changes.guard.ts, app.routes.ts, checklist-page.component.ts
