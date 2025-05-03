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
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          const savedLinks = user.links.map(link => ({ ...link, isEditing: false }));
          this.linksSubject.next(savedLinks);
        }
    });
  }

  addNewLink() {
    const currentLinks = this.linksSubject.getValue();
    const updatedLinks = currentLinks.map(link => ({ ...link, isEditing: false }));
    updatedLinks.push({ id: -1, link_type: '', link_url: '', isEditing: true });
    this.linksSubject.next(updatedLinks);
  }

  removeNewLink() {
    const currentLinks = this.linksSubject.getValue();
    const updatedLinks = currentLinks.filter(link => link.id !== -1)
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

  deleteLink(linkId: number): Observable<string> {
    return this.http.delete(`${environment.apiUrl}/link/${linkId}`, { withCredentials: true })
      .pipe(
        takeUntil(this.destroy$),
        map(() => {
          const currentLinks = this.linksSubject.getValue();
          const updatedLinks = currentLinks.filter(link => link.id !== linkId);
          this.linksSubject.next(updatedLinks);
          return 'Link deleted successfully';
        }),
        catchError(error => {
          console.error('Failed to delete link:', error);
          return of('Failed to delete link');
        })
      );
  }

  updateLink(linkId: number, updatedLink: LinkBasicInfo): Observable<string> {
    return this.http.put(`${environment.apiUrl}/link/${linkId}`, updatedLink, { withCredentials: true })
      .pipe(
        takeUntil(this.destroy$),
        map(() => {
          const currentLinks = this.linksSubject.getValue();
          const linkIndex = currentLinks.findIndex(link => link.id === linkId);
          if (linkIndex !== -1) {
            currentLinks[linkIndex] = { ...currentLinks[linkIndex], ...updatedLink };
            this.linksSubject.next(currentLinks);
          }
          return 'Link updated successfully';
        }),
        catchError(error => {
          console.error('Failed to update link:', error);
          return of('Failed to update link');
        })
      );
  }

}
