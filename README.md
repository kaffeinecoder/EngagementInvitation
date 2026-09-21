# Pavan & Sanjana — Engagement Invitation

Mobile-first React + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide React.

## Run
npm install
npm run dev

## Notes
- Event data lives in `src/data/engagementData.ts`.
- Generated temple artwork is included at `src/assets/temple-gopuram.png`.
- RSVP submission is front-end only; connect it to your preferred backend/form service for real responses.
- Wishes persist in browser localStorage.
- Replace the three Unsplash carousel URLs with final couple photos before launch.
- Add a real music/audio source to `MusicPlayer` if background music is desired.

## Google Sheet RSVP

The ready-to-paste Apps Script is in `google-apps-script/Code.gs`. It is configured for the provided spreadsheet ID.

1. Open **Extensions > Apps Script** from the provided Google Sheet, or create a standalone Apps Script project.
2. Paste in `google-apps-script/Code.gs`.
3. Deploy it as a **Web app** with **Execute as: Me** and **Who has access: Anyone**.
4. Authorize the script when Google asks for spreadsheet access.
5. Replace `RSVP_ENDPOINT` in `src/InvitationExperience.tsx` with the deployed Web App URL.

The script creates an `RSVP` tab and adds the headers automatically. Do not make the spreadsheet public or share your Gmail credentials.
