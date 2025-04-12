import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { AuthRequest, GenericResponse } from '../models/generic.model';

interface UpdateUserRequest {
  email: string;
  firstname: string;
  lastname: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(userData: AuthRequest): Promise<GenericResponse> {
    return lastValueFrom(this.http.post<GenericResponse>(`${environment.apiUrl}/register`, userData));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/me`, { withCredentials: true });
  }

  // updateUser(userData: UpdateUserRequest, user_id: number): Promise<GenericResponse> {
  //   return lastValueFrom(this.http.put<GenericResponse>(`${environment.apiUrl}/user/${user_id}`, userData));
  // }
}
