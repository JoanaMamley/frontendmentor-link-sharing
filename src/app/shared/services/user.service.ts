import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
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
  private _currentUser$ = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser$.asObservable();

  setCurrentUser(user: User | null) {
    this._currentUser$.next(user);
  }

  getCurrentUserValue(): User | null {
    return this._currentUser$.value;
  }

  constructor(private http: HttpClient) { }

  register(userData: AuthRequest): Promise<GenericResponse> {
    return lastValueFrom(this.http.post<GenericResponse>(`${environment.apiUrl}/register`, userData));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/me`, { withCredentials: true });
  }

  updateUser(userData: UpdateUserRequest, user_id: number): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/user/${user_id}`, userData, {withCredentials: true});
  }
}
