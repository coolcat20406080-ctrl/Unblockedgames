export const CLOAK_PROFILES = [
  {
    id: 'default',
    name: 'Default (Apex Games)',
    title: 'Apex Unblocked Games',
    faviconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'><path d='M6 11h4V7h2v4h4v2h-4v4h-2v-4H6v-2z'/><path fill-rule='evenodd' d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm10-8a8 8 0 100 16 8 8 0 000-16z' clip-rule='evenodd'/></svg>"
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Home - Classroom',
    faviconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%231E8E3E' d='M44 38H4V10h40z'/><path fill='%23FFF' d='M24 16a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-12 18c0-4 8-6 12-6s12 2 12 6v2H12v-2z'/></svg>"
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    faviconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 87.3 78'><path fill='%230066da' d='m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z'/><path fill='%2300ac47' d='M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z'/><path fill='%23ea4335' d='m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.1z'/><path fill='%2300832d' d='M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z'/><path fill='%232684fc' d='M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z'/><path fill='%23ffba00' d='m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z'/></svg>"
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    faviconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%234285F4' d='M30 6H12a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V16L30 6z'/><path fill='%23FFF' d='M16 22h16v2H16zm0 6h16v2H16zm0 6h10v2H16z'/></svg>"
  },
  {
    id: 'desmos',
    name: 'Desmos Graphing Calculator',
    title: 'Desmos | Graphing Calculator',
    faviconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23287042'><rect width='24' height='24' rx='4'/><path stroke='%23fff' stroke-width='2' fill='none' d='M4 18c6 0 6-12 16-12'/></svg>"
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Instructure Canvas',
    faviconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e02424'><circle cx='12' cy='12' r='10'/><path stroke='%23fff' stroke-width='3' stroke-linecap='round' d='M8 12h8M12 8v8'/></svg>"
  }
];

export function applyCloakProfile(profileId) {
  const profile = CLOAK_PROFILES.find(p => p.id === profileId) || CLOAK_PROFILES[0];
  document.title = profile.title;

  const faviconLink = document.getElementById('page-favicon');
  if (faviconLink) {
    faviconLink.href = profile.faviconSvg;
  }
  localStorage.setItem('apex_cloak_profile', profileId);
}

export function openAboutBlankGame(iframeUrl, title) {
  const newWin = window.open('about:blank', '_blank');
  if (newWin) {
    newWin.document.title = title;
    newWin.document.body.style.margin = '0';
    newWin.document.body.style.height = '100vh';
    newWin.document.body.style.overflow = 'hidden';
    newWin.document.body.style.background = '#020617';

    const iframe = newWin.document.createElement('iframe');
    iframe.src = window.location.origin + (iframeUrl.startsWith('/') ? iframeUrl : '/' + iframeUrl);
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allow = 'fullscreen; autoplay';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');

    newWin.document.body.appendChild(iframe);
  }
}
