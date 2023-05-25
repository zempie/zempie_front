

export const openCenteredPopup = (url: string, title: string, w: number, h: number) => {
  const left = (screen.width - w) / 2;
  const top = (screen.height - h) / 2;

  window.open(url, title, `width=${w},height=${h},left=${left},top=${top}`);
}
