import { Link } from "./link.model";

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  links: Link[];
}