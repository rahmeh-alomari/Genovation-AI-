import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  initDynamicMeta(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const title = data['metaTitle'] || 'Default Title';
      const description = data['metaDescription'] || 'Default description.';
      const keywords = data['metaKeywords'] || 'angular, site, app';
    console.log("keywords",keywords)

      this.setMeta(title, description, keywords);
    });
  }

  setMeta(title: string, description: string, keywords?: string) {
    console.log("title",title)
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    }
  }
}