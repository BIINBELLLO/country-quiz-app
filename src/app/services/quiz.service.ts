import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class QuizService {
  constructor(private http: HttpClient) {}

  getAllCountriesData(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${environment.apiUrl}/all`);
  }
}
