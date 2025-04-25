import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { Link, LinkBasicInfo, RawLinkItem } from '../models/link.model';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private linksSubject = new BehaviorSubject<Link[]>([]);
  links$: Observable<Link[]> = this.linksSubject.asObservable();
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService, private http: HttpClient) {
    this.loadSavedLinks();
  }

  private loadSavedLinks() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        const savedLinks = user.links.map(link => ({ ...link, isEditing: false }));
        this.linksSubject.next(savedLinks);
    });
  }

  addNewLink() {
    const currentLinks = this.linksSubject.getValue();
    const updatedLinks = currentLinks.map(link => ({ ...link, isEditing: false }));
    updatedLinks.push({ id: -1, link_type: '', link_url: '', isEditing: true });
    this.linksSubject.next(updatedLinks);
  }

  private addLink(link: LinkBasicInfo): Observable<RawLinkItem> {
    return this.http.post<RawLinkItem>(`${environment.apiUrl}/link`, link, { withCredentials: true });
  }

  saveLink(newLink: LinkBasicInfo): Observable<string> {
    return this.addLink(newLink)
      .pipe(
        takeUntil(this.destroy$),
        map((updatedLink: RawLinkItem) => {
          const currentLinks = this.linksSubject.getValue();
          const newLinkItem: Link = {
            id: updatedLink.id,
            link_type: updatedLink.link_type,
            link_url: updatedLink.link_url,
            isEditing: false
          };
          const updatedLinks = currentLinks.map(link => (link.id === -1 ? newLinkItem : link));
          this.linksSubject.next(updatedLinks);
          return 'Link saved successfully';
        }),
        catchError(error => {
          console.error('Failed to save link:', error);
          return of('Failed to save link');
        })
      );
  }

}
