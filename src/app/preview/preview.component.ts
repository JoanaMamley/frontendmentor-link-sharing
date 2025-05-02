import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Link, LINKDETAILS, LinkOptionDetail } from '../shared/models/link.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs';

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

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute){}

  ngOnInit(): void {
    let userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      const userSub = this.userService.getUser(parseInt(userId)).subscribe(user => {
        this.user = user;
        this.links = user.links;
      });

      this.subscriptions.push(userSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
