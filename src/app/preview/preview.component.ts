import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Link, LINKDETAILS, LinkOptionDetail } from '../shared/models/link.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface LinkDesc{
  name: string;
  icon: string;
  color: string;
}
@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent implements OnInit, OnDestroy{
  linkItems: LinkDesc[] = [LINKDETAILS['github'], LINKDETAILS['youtube'], LINKDETAILS['linkedIn']];
  user?: User;
  subscriptions: Subscription[] = [];
  links?: Link[];
  linkTypes = LINKDETAILS;
  profileImageUrl: string | SafeUrl = 'images/empty_profile_image.png';
  private profileObjectUrl: string | null = null;
  errorMessage: string | null = null;
  

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute, private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    let userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      const userSub = this.userService.getUser(parseInt(userId)).subscribe(user => {
        this.user = user;
        this.links = user.links;
        this.loadProfileImage();
      });

      this.subscriptions.push(userSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  getlinkIcon(linkType: LinkDesc): string {
    return `images/${linkType.icon}`;
  }

  navigateToEditor() {
    this.router.navigateByUrl('/home');
  }

  fetchLinkDetails(linkType: string): LinkOptionDetail {
      return this.linkTypes[linkType];
  }
}
