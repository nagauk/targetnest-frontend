import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = environment.propertyApiUrl;

  constructor(private http: HttpClient) { }

  getAllProperties(page: number = 0, size: number = 12): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getPropertiesForSale(page: number = 0, size: number = 12): Observable<any> {
    return this.http.get(`${this.apiUrl}/for-sale?page=${page}&size=${size}`);
  }

  getPropertiesForRent(page: number = 0, size: number = 12): Observable<any> {
    return this.http.get(`${this.apiUrl}/for-rent?page=${page}&size=${size}`);
  }

  searchProperties(criteria: any): Observable<any> {
    let params = new HttpParams();
    if (criteria.keyword) params = params.set('keyword', criteria.keyword);
    if (criteria.listingType) params = params.set('listingType', criteria.listingType);
    if (criteria.propertyType) params = params.set('propertyType', criteria.propertyType);
    if (criteria.minPrice) params = params.set('minPrice', criteria.minPrice);
    if (criteria.maxPrice) params = params.set('maxPrice', criteria.maxPrice);
    if (criteria.minBedrooms) params = params.set('minBedrooms', criteria.minBedrooms);
    if (criteria.minBathrooms) params = params.set('minBathrooms', criteria.minBathrooms);
    params = params.set('page', criteria.page || 0);
    params = params.set('size', criteria.size || 12);

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getFeaturedProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/featured`);
  }

  getPropertyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUserProperties(userId: number, page: number = 0, size: number = 12): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}?page=${page}&size=${size}`);
  }

  createProperty(property: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, property, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
  }

  updateProperty(id: number, property: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, property, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
  }
}
