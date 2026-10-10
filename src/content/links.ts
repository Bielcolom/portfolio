export const EMAIL = "gabrielcolomoll@gmail.com";

/** A mailto that opens with the subject and body already written. RFC 6068 wants CRLF line breaks */
export const mailto = ({ subject, body }: { subject: string; body: string }) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, "\r\n"))}`;

export const PROFILE_LINKS = [
  { name: "LinkedIn", handle: "in/gabriel-colom-moll", url: "https://www.linkedin.com/in/gabriel-colom-moll/" },
  { name: "GitHub", handle: "github.com/Bielcolom", url: "https://github.com/Bielcolom" },
];
