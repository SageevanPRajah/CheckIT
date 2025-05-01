export interface CourseRequest {
    title: string;
    description: string;
}

export interface CourseResponse {
    id: number;
    title: string;
    description: string;
    instructorId: number;
    instructorUsername: string;
}