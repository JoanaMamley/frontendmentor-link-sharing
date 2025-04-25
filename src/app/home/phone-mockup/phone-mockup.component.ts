import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Link, LINKDETAILS, LinkOptionDetail } from '../../shared/models/link.model';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LinkService } from '../../shared/services/link.service';

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

  constructor(private userService: UserService, private linkService: LinkService){}

  ngOnInit(): void {
    const userSub = this.userService.currentUser$.subscribe((user) => {
      this.user = user;
    })

    const linksSub = this.linkService.links$.subscribe((links) => {
      this.userLinks = links;
    })

    this.subscriptions.push(userSub, linksSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  fetchLinkDetails(linkType: string): LinkOptionDetail {
      return this.linkTypes[linkType];
  }
}
