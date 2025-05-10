# README: Verification Button for Gaming Server

This document provides details about the `Verify` button functionality, which ensures that users meet the necessary requirements to maintain the integrity of the gaming server.

---

## Features

- A **green `Verify` button** that users can click to initiate the verification process.
- The verification process checks the following:
    - The user has a valid **email address** attached to their account.
    - The user has a valid **phone number** linked to their account.
    - Any additional rules or requirements necessary for maintaining the gaming server's standards.
    - The user selects their **gender** from a dropdown menu after successful verification.

---

## Usage

1. Locate the **green `Verify` button** in the application interface.
2. Click the button to start the verification process.
3. The system will:
     - Validate the presence of an email and phone number.
     - Check compliance with other server rules.
4. If all checks pass:
     - The user will be prompted to select their **gender** from a dropdown menu.
     - Based on the selection, the user will be assigned a role (`Male` or `Female`).
5. If any errors occur during the verification process, the user will be prevented from joining the server.

---

## Example Button (Markdown)

```html
<a href="#" style="background-color: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify</a>
```

---

## Notes

- Ensure your email and phone number are up-to-date before clicking the `Verify` button.
- Contact support if you encounter any issues during the verification process.
- Users who fail the verification process will not be allowed to join the server.

---  