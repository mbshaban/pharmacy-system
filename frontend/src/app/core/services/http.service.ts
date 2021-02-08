import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment as localEnvironment} from '../../../environments/environment';
import {environment as productionEnvironment} from '../../../environments/environment.prod';
import {Observable} from 'rxjs';

export interface IHttpResponse {
    body: any;
    headers: HttpHeaders;
    ok: boolean;
    status: number;
    url?: string;
    statusText?: string;
    type?: number;
}

@Injectable()
export class HttpService {
    baseUrl: string;
    env = localEnvironment || productionEnvironment;

    constructor(private http: HttpClient) {

        this.baseUrl = this.env.baseUrl.backend.main;
    }


    _post(url: string, data, options?: {}): Observable<any> {
        data = this.prepareDataFormat(data);
        return this.http.post(this.baseUrl + url, data, options);
    }

    postSpecial(url: string, data, options?: {}): Observable<any> {
        return this.http.post(this.baseUrl + url, data, options);
    }

    get(url: string, options?: {}): Observable<any> {
        return this.http.get(this.baseUrl + url, options);
    }

    delete(url: string, options?: {}): Observable<any> {
        return this.http.delete(this.baseUrl + url, options);
    }

    head(url: string, options?: {}): Observable<any> {
        return this.http.head(this.baseUrl + url, options);
    }

   _put(url: string, data, options?: {}): Observable<any> {
        data = this.prepareDataFormat(data);
        return this.http.put(this.baseUrl + url, data, options);
    }

    options(url: string, options?: {}): Observable<any> {
        return this.http.options(this.baseUrl + url, options);
    }

    patch(url: string, data, options?: {}): Observable<any> {
        data = this.prepareDataFormat(data);
        return this.http.patch(this.baseUrl + url, data, options);
    }

    jsonp(url: string, options = ''): Observable<any> {
        return this.http.jsonp(this.baseUrl + url, options);
    }

    download(url: string): Observable<any> {
        return this.http.get(this.baseUrl + url, {responseType: 'blob'});
    }

    prepareDataFormat(data): FormData {
        if (data) {
            if (data.constructor.name === 'Array') {
                this.iterateArray(data);
            } else if (data.constructor.name === 'Object') {
                this.iterateObject(data);
            }
        }
        return data;
    }

    iterateArray(data) {
        for (let i = 0; i < data.length; i++) {
            const property = data[i];
            if (property instanceof Date) {
                data[i] = property.getFullYear() + '-' + (property.getMonth() + 1) + '-' + property.getDate();
            } else if (property && property.constructor.name === 'Array') {
                this.iterateArray(property);
            } else if (property && property.constructor.name === 'Object') {
                this.iterateObject(property);
            }
        }
    }

    iterateObject(data) {
        for (const property in data) {
            if (data.hasOwnProperty(property)) {
                if (data[property] instanceof Date) {
                    data[property] = data[property].getFullYear() + '-' + (data[property].getMonth() + 1) + '-' + data[property].getDate();
                } else if (data[property] && data[property].constructor.name === 'Array') {
                    this.iterateArray(data[property]);
                } else if (data[property] && data[property].constructor.name === 'Object') {
                    this.iterateObject(data[property]);
                }
            }
        }
    }


}
