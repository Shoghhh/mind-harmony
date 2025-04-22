export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2,
}

export const PriorityLabels: Record<Priority, string> = {
    [Priority.Low]: "low",
    [Priority.Medium]: "medium",
    [Priority.High]: "high",
};

export enum Sort {
    CreatedDate = 0,
    CompletedDate = 1,
    AssignedDate = 3,
    Priority = 2,
}

export const SortLabels: Record<Sort, string> = {
    [Sort.CreatedDate]: "Date Created",
    [Sort.CompletedDate]: "Date Completed",
    [Sort.AssignedDate]: "Date Assigned",  
    [Sort.Priority]: "Priority",
};

export enum Date {
    ByDay = 0,
    ByMonth = 1,
    ByYear = 2,
}

export const DateLabels: Record<Date, string> = {
    [Date.ByDay]: "By day",
    [Date.ByMonth]: "By month",
    [Date.ByYear]: "By year",
};

