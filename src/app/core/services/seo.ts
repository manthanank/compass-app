import { inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  public setPageSeo(titleText: string, description: string) {
    const fullTitle = `${titleText} | Apex Digital Compass & Outdoor GPS`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ property: 'twitter:description', content: description });
  }
}
