Team headshots go in this folder.

Naming: 1.png, 2.png, 3.png ... matching the "img" field of each person
in team.js (e.g. img: 'team/7.png' -> put the photo at team/7.png).

Currently expected, in order:
  1.png  Kittikawin Sawanglab  — Project Lead
  2.png  (placeholder)         — Developer
  3.png  (placeholder)         — Developer
  4.png  (placeholder)         — Creative
  5.png  (placeholder)         — Researcher
  6.png  (placeholder)         — Researcher
  7.png  (placeholder)         — Researcher   <- new researcher card

To swap a photo: overwrite the numbered file, no code change needed.
To add a new person: add an entry in team.js with the next free number
(e.g. img: 'team/8.png') and drop team/8.png in here.

Recommended: square image, at least 300x300px (cards display it as a
104px circle, 132px for the Project Lead card), .png or .jpg both work
— just update the extension in team.js if you use .jpg.

This file is just documentation and isn't loaded by the site — delete
it whenever, it won't break anything.
