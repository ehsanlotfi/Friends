export enum QuoteType
{
    EASY,
    MEDIUM,
    HARD
}

export interface Quote
{
    ID: number;
    Content: string,
    Trans: string,
    Season: number,
    Capture: number,
    Type: QuoteType,
    DateSeen: number,
    CntSeen: number,
    showTrans?: boolean
}