import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

export class ToolUtils
{
    public static FormatFullDate(date:string) : string
    {
        const datepipe: DatePipe = new DatePipe('en-US')
        let formattedDate = datepipe.transform(date, "dd/MM/yyyy - hh:mm")

        return formattedDate || "-";
    }

    public static FormatDate(date:string) : string
    {
        const datepipe: DatePipe = new DatePipe('en-US')
        let formattedDate = datepipe.transform(date, "dd/MM/yyyy")

        return formattedDate || "-";
    }

    public static FormatTime(date:string) : string
    {
        const datepipe: DatePipe = new DatePipe('en-US')
        let formattedDate = datepipe.transform(date, "hh:mm:ss")

        return formattedDate || "-";
    }

    public static FormatUrl(routeUrl:string) : string
    {
        return environment.webUrl + "/" + routeUrl;
        //return protocol + "//" + hostname + ":" + port + "/" + routeUrl;
    }
}