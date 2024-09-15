import { Episode } from "./episode.model";

export interface Season
{
    number: number;
    season: string;
    title: string;
    date: string;
    director: string;
    writers: string[];
    stars: string[];
    summary: string;
    episodes?: Episode[];
}