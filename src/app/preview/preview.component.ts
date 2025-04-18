import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

const LINKDETAILS: Record<string, LinkDesc> = {
  github: {
    name: 'Github',
    icon: 'icon-github.svg',
    color: '#1A1A1A'
  },
  frontendMentor: {
    name: 'Frontend Mentor',
    icon: 'icon-frontend-mentor.svg',
    color: '#FFFFFF'
  },
  twitter: {
    name: 'Twitter',
    icon: 'icon-twitter.svg',
    color: '#67BECE'
  },
  linkedIn: {
    name: 'LinkedIn',
    icon: 'icon-linkedin.svg',
    color: '#2D68FF'
  },
  youtube: {
    name: 'Youtube',
    icon: 'icon-youtube.svg',
    color: '#EE3939'   
  },
  facebook: {
    name: 'Facebook',
    icon: 'icon-facebook.svg',
    color: '#2442AC' 
  },
  twitch: {
    name: 'Twitch',
    icon: 'icon-twitch.svg',
    color: '#EE3FC8' 
  },
  devto: {
    name: 'Dev.to',
    icon: 'icon-devto.svg',
    color: '#333333'    
  },
  codewars: {
    name: 'Codewars',
    icon: 'icon-codewars.svg',
    color: '#8A1A50'    
  },
  freeCodeCamp: {
    name: 'FreeCodeCamp',
    icon: 'icon-freecodecamp.svg',
    color: '#302267'    
  },
  gitlab: {
    name: 'Gitlab',
    icon: 'icon-gitlab.svg',
    color: '#EB4925'    
  },
  hashnode: {
    name: 'Hashnode',
    icon: 'icon-hashnode.svg',
    color: '#0330D1'    
  },
  stackOverflow: {
    name: 'Stack Overflow',
    icon: 'icon-stack-overflow.svg',
    color: '#EC7100'    
  },
}
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
export class PreviewComponent {
  linkItems: LinkDesc[] = [LINKDETAILS['github'], LINKDETAILS['youtube'], LINKDETAILS['linkedIn']];

  getlinkIcon(linkType: LinkDesc): string {
    return `images/${linkType.icon}`;
  }
}
