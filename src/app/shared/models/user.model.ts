import { Link } from "./link.model";

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  links: Link[];
}