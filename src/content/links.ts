export const EMAIL = "gabrielcolomoll@gmail.com";

type Draft = { subject: string; body: string };

const enc = encodeURIComponent;
const crlf = (text: string) => text.replace(/\n/g, "\r\n");

/** A mailto that opens with the subject and body already written. RFC 6068 wants CRLF line breaks */
export const mailto = ({ subject, body }: Draft) =>
  `mailto:${EMAIL}?subject=${enc(subject)}&body=${enc(crlf(body))}`;

/* The same draft in the browser's own webmail, for computers where mailto
   leads nowhere: no mail app set up, or one that has been uninstalled */
export const gmailCompose = ({ subject, body }: Draft) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(EMAIL)}&su=${enc(subject)}&body=${enc(crlf(body))}`;

export const outlookCompose = ({ subject, body }: Draft) =>
  `https://outlook.office.com/mail/deeplink/compose?to=${enc(EMAIL)}&subject=${enc(subject)}&body=${enc(crlf(body))}`;

/** Phones hand mailto to their mail app; computers get a choice of where to write */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export const PROFILE_LINKS = [
  { name: "LinkedIn", handle: "in/gabriel-colom-moll", url: "https://www.linkedin.com/in/gabriel-colom-moll/" },
  { name: "GitHub", handle: "github.com/Bielcolom", url: "https://github.com/Bielcolom" },
];
