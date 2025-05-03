import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Link, LINKDETAILS, LinkOptionDetail } from '../../shared/models/link.model';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LinkService } from '../../shared/services/link.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'phone-mockup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phone-mockup.component.html',
  styleUrl: './phone-mockup.component.scss'
})
export class PhoneMockupComponent implements OnInit, OnDestroy{
  user: User | null = null;
  subscriptions: Subscription[] = [];
  linkTypes = LINKDETAILS;
  userLinks?: Link[];
  profileImageUrl: string | SafeUrl = 'images/empty_profile_image.png';
  private profileObjectUrl: string | null = null;
  errorMessage: string | null = null;

  constructor(private userService: UserService, private linkService: LinkService, private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    const userSub = this.userService.currentUser$.subscribe((user) => {
      this.user = user;
      this.loadProfileImage();
    })

    const linksSub = this.linkService.links$.subscribe((links) => {
      this.userLinks = links.filter(link => link.isEditing !== true);
    })

    this.subscriptions.push(userSub, linksSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  loadProfileImage(): void {
    if (this.user) {
      const sub = this.userService.getProfileImage(this.user.id).subscribe({
        next: (blob) => {
          if (this.profileObjectUrl) {
            URL.revokeObjectURL(this.profileObjectUrl);
          }
          this.profileObjectUrl = URL.createObjectURL(blob);
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.profileObjectUrl);
        },
        error: (err) => {
          if (err.status === 404) {
            this.profileImageUrl = 'images/empty_profile_image.png';
          } else {
            this.errorMessage = 'Failed to load profile image';
          }
        }
      });

      this.subscriptions.push(sub);
    }
  }

  fetchLinkDetails(linkType: string): LinkOptionDetail {
      return this.linkTypes[linkType];
  }
}
