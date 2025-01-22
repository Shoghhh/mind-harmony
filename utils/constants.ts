export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2,
}

export const PriorityLabels: Record<Priority, string> = {
    [Priority.Low]: "Low",
    [Priority.Medium]: "Medium",
    [Priority.High]: "High",
};

export enum Sort {
    CreatedDate = 0,
    CompletedDate = 1,
    Priority = 2,
}

export const SortLabels: Record<Sort, string> = {
    [Sort.CreatedDate]: "Date Created",
    [Sort.CompletedDate]: "Date Completed",
    [Sort.Priority]: "Priority",
};
