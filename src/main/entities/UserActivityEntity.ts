export interface UserActivityEntity {
    skip?: Number;
    take?: Number;
    sub?: string;
    startDate?: string;
    endDate?: string;
    events?: [string];
}