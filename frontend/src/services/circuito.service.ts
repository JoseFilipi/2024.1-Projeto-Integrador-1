import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import Circuito from 'src/interfaces/Circuito';

@Injectable({
  providedIn: 'root'
})
export class CircuitoService {

  private readonly api: string = 'http://localhost:3000/circuito';

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllCircuits(): Observable<Circuito[]> {
    return this.httpClient.get<Circuito[]>(this.api).pipe(
      take(1)
    );
  }

}