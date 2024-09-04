import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CookieService {

    public constructor(@Inject(DOCUMENT) private document: Document) { }

    public get(name: string) {
        const cookies = this.document.cookie.split('; ')
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    public clear() {
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.localStorage.clear();
        window.location.reload();
    }
}