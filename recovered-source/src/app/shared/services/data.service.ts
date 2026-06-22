import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Poject {
  description: string;
  title: string;
  images: {
    src: string;
    srcset: string;
    sizes: string;
    description: string;
    data: {
      width: number;
      height: number;
      type: string;
    };
    alt: string;
    gifSrc?: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class DataService {
  dataLoaded = new BehaviorSubject<boolean>(false);
  projects: any;

  constructor(private http: HttpClient) {}
  getData() {
    this.http.get("./assets/works/data.json").subscribe((response: any) => {
      this.projects = response;
      this.dataLoaded.next(true);
    });
  }
}
