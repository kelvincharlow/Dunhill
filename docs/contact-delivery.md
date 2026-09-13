# Contact delivery setup

The Contact page is /contact. Header project CTAs and footer contact links open it. Address, office phone numbers and email use the previously extracted 2026 company profile pages 2 and 9; confirm the general enquiry inbox and telephone numbers before launch.

## Current behaviour

No delivery provider is configured. The form validates and prepares a mailto draft, explicitly stating that nothing is sent until the visitor sends it from their email app. Input is not saved to a database or logged. Long mailto messages may exceed limits in some email clients; configure server delivery for production use. The location card links to Google Maps and does not embed a map or send visitor data to Google on page load.

## Connect delivery

Configure ENQUIRY_WEBHOOK_URL (HTTPS only) and ENQUIRY_WEBHOOK_TOKEN in the deployment's server-side secret settings. Never use NEXT_PUBLIC_ variables for these. Use a company-approved endpoint that accepts JSON POST requests with Authorization: Bearer <token>. The payload is { enquiry: {name, company, email, phone, service, location, value, description, consent}, submittedAt }. A 2xx response must mean the endpoint has accepted the enquiry for delivery. The receiver should deliver to the approved company inbox, implement duplicate handling and avoid logging personal data. Reject unsuccessful delivery with a non-2xx response.

The website only shows success after a 2xx upstream response, not confirmation that a person received or read an email. A timeout can leave delivery status uncertain; input is retained and a draft fallback offered. No real external delivery has been tested yet.

## Before production

- Confirm the recipient, provider, data-retention policy and public privacy wording with the company.
- Enable persistent rate limiting / bot protection at the hosting edge or approved delivery provider. The form has a honeypot, bounded request size, same-origin browser check and server validation, but these are not a complete anti-spam solution.
- Check same-origin validation behind the production proxy; request.url origin must match the public browser origin.
- Verify success, rejection, timeout, duplicate submission and delivery to the approved inbox using explicitly authorised test messages.
- Do not ask for sensitive financial or identity documents through this form.
