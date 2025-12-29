# P.H Paribahan — E-ticketing UI

A simple front-end prototype for a bus e-ticketing booking interface. Features:

- Select up to 4 seats from a grid.
- Real-time subtotal and grand total calculation.
- Coupon support: `NEW15` (15% off) and `COUPLE20` (20% off) when 4 seats selected.
- Passenger form validation; shows confirmation modal and reloads to clear selections.

Getting started

1. Open `index.html` in a browser (no build step required).
2. Select seats on the left; prices update on the right.
3. Select 4 seats to enable coupon entry; apply `NEW15` or `COUPLE20`.
4. Fill passenger name, phone and email to enable `Next`; click to see confirmation.

Files

- `index.html` — main UI
- `utility.js` — seat selection, totals, coupon and form logic
- `scripts.js` — small page behavior (scroll, initialization)
- `tailwind.css` — styles
- `images/` — asset folder

Author

Farhan Fuad

License

MIT — feel free to reuse and adapt for demos or learning purposes.