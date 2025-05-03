import { User } from "./user.model";

export interface Link {
  id: number;
  link_type: string;
  link_url: string;
  isEditing?: boolean;
}

export type LinkBasicInfo = Pick<Link, 'link_type' | 'link_url'>;

export interface RawLinkItem {
  id: number;
  link_type: string;
  link_url: string;
  user_id: number;
  user: User
}

export interface LinkOptionDetail {
  name: string;
  icon: string;
  white_icon: string;
  color: string;
}

export const LINKDETAILS: Record<string, LinkDesc> = {
  github: {
    name: 'Github',
    icon: 'images/icon-github.svg',
    white_icon: 'images/white-icons/icon-github.svg',
    color: '#1A1A1A'
  },
  frontendMentor: {
    name: 'Frontend Mentor',
    icon: 'images/icon-frontend-mentor.svg',
    white_icon: 'images/white-icons/icon-frontend-mentor.svg',
    color: '#FFFFFF'
  },
  twitter: {
    name: 'Twitter',
    icon: 'images/icon-twitter.svg',
    white_icon: 'images/white-icons/icon-twitter.svg',
    color: '#67BECE'
  },
  linkedIn: {
    name: 'LinkedIn',
    icon: 'images/icon-linkedin.svg',
    white_icon: 'images/white-icons/icon-linkedin.svg',
    color: '#2D68FF'
  },
  youtube: {
    name: 'Youtube',
    icon: 'images/icon-youtube.svg',
    white_icon: 'images/white-icons/icon-youtube.svg',
    color: '#EE3939'
  },
  facebook: {
    name: 'Facebook',
    icon: 'images/icon-facebook.svg',
    white_icon: 'images/white-icons/icon-facebook.svg',
    color: '#2442AC' 
  },
  twitch: {
    name: 'Twitch',
    icon: 'images/icon-twitch.svg',
    white_icon: 'images/white-icons/icon-twitch.svg',
    color: '#EE3FC8' 
  },
  devto: {
    name: 'Dev.to',
    icon: 'images/icon-devto.svg',
    white_icon: 'images/white-icons/icon-devto.svg',
    color: '#333333'    
  },
  codewars: {
    name: 'Codewars',
    icon: 'images/icon-codewars.svg',
    white_icon: 'images/white-icons/icon-codewars.svg',
    color: '#8A1A50'    
  },
  freeCodeCamp: {
    name: 'FreeCodeCamp',
    icon: 'images/icon-freecodecamp.svg',
    white_icon: 'images/white-icons/icon-freecodecamp.svg',
    color: '#302267'    
  },
  gitlab: {
    name: 'Gitlab',
    icon: 'images/icon-gitlab.svg',
    white_icon: 'images/white-icons/icon-gitlab.svg',
    color: '#EB4925'    
  },
  hashnode: {
    name: 'Hashnode',
    icon: 'images/icon-hashnode.svg',
    white_icon: 'images/white-icons/icon-hashnode.svg',
    color: '#0330D1'    
  },
  stackOverflow: {
    name: 'Stack Overflow',
    icon: 'images/icon-stack-overflow.svg',
    white_icon: 'images/white-icons/icon-stack-overflow.svg',
    color: '#EC7100'    
  },
}
export interface LinkDesc {
  name: string;
  icon: string;
  white_icon: string
  color: string;
}

export interface LinkSGVDesc {
  name: string;
  svg: string;
}