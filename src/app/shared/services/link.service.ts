import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  constructor(private userService: UserService, private http: HttpClient) {
    this.loadSavedLinks();
  }

  private loadSavedLinks() {
    this.userService.getCurrentUser().subscribe(user => {
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

  saveLink(newLink: LinkBasicInfo) {
    this.addLink(newLink).subscribe(updatedLink => {
      const currentLinks = this.linksSubject.getValue();
      const updatedLinks = currentLinks.map(link => {
        if (link.id === -1) {
          return { ...link, id: updatedLink.id, link_type: updatedLink.link_type, link_url: updatedLink.link_url, isEditing: false };
        }
        return link;
      });
      this.linksSubject.next(updatedLinks);
    });
  }
}
