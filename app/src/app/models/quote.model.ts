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
    Level: number,
    showTrans?: boolean
}

export interface Statistics
{
    Learned: number,
    LongTermMemory: number,
    ShortTermMemory: number,
    NeedReview: number,
}