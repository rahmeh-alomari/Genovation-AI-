import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
 private linkId = 'prime-theme-css';

changeTheme(themeName: string) {
  const href = `https://cdn.jsdelivr.net/npm/primeng/resources/themes/${themeName}/theme.css`;

  let existingLink = document.getElementById('prime-theme-css') as HTMLLinkElement;
  if (existingLink) {
    existingLink.href = href;

  } else {
    const link = document.createElement('link');
    link.id = 'prime-theme-css';
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    console.log("link",link)

  }

  localStorage.setItem('app-theme', themeName);

}


  loadSavedTheme() {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      this.changeTheme(savedTheme);
    } else {
      this.changeTheme('lara-light-blue');
    }
  }
}