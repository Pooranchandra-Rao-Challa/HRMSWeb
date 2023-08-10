export const FORMAT_DATE = (date: Date): Date => { return new Date(Date.UTC(date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()));}
    
    export const MEDIUM_DATE = 'dd-MMM-yyyy';
    export const SHORT_DATE = 'dd-MM-yyyy';
    export const LONG_DATE = 'dd MMMM, yyyy';
    