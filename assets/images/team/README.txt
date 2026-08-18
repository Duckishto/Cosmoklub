Team headshots go in this folder: assets/images/team/

Naming: 1.png, 2.jpg, 3.jpg ... matching the "img" field of each person
in assets/js/team.js (e.g. img: 'assets/images/team/7.jpg' -> put the
photo at assets/images/team/7.jpg).

Currently expected, in order:
  1.png  Kittikawin Sawanglab            — Project Lead
  2.jpg  Kritsadaphas Sangthong          — Developer
  3.jpg  Siraphop Larbninjinda           — Developer
  4.jpg  Weerawit Watjanarat             — Creative
  5.jpg  Pattanan Naosaran               — Researcher
  6.jpg  Watcharaphon Pisutwatthanasakul — Researcher
  7.jpg  Thanaphat Chaipanukiat          — Project Helper

To swap a photo: overwrite the numbered file, no code change needed.
To add a new person: add an entry in assets/js/team.js with the next
free number (e.g. img: 'assets/images/team/8.png') and drop
assets/images/team/8.png in here.

Recommended: square image, at least 300x300px (cards display it as a
104px circle, 132px for the Project Lead card), .png or .jpg both work
— just match the extension you use in team.js.

This file is just documentation and isn't loaded by the site — delete
it whenever, it won't break anything.
