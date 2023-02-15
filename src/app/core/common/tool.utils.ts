import { DatePipe } from '@angular/common';

export class ToolUtils
{
    static FormatDate(date:string) : string
    {
        const datepipe: DatePipe = new DatePipe('en-US')
        let formattedDate = datepipe.transform(date, "dd/MM/yyyy - hh:mm")

        return formattedDate || "-";
    }
}