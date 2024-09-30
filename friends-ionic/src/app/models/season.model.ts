import { Episode } from "./episode.model";

export interface Season
{
    number: number;
    from: string;
    to: string;
    episodes?: Episode[];
}