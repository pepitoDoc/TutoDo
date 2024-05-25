
export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface InsertUserRequest {
    username: string;
    email: string;
    password: string;
}

export interface GuideStep {
    title: string;
    description: string;
}

export interface CreateGuideRequest {
    title: string;
    description: string;
    guideTypes: string[];
    ingredients: string[];
}

export interface Step {
    title: string;
    description: string;
}

export interface FormStep {
    title: string;
    description: string;
    saved: boolean;
}

export interface SaveGuideStepsRequest {
    guideId: string;
    steps: Step[];
    published: boolean;
}

export interface SharedData {
    key: string;
    value: string;
}

export interface Rating {
    userId: string;
    punctuation: number;
}
export interface Guide {
    id: string;
    userid: string;
    title: string;
    description: string;
    published: boolean;
    creationDate: string;
    steps: Step[];
    guideTypes: string[];
    ingredients: string[];
    comments: string[];
    ratings: Rating[];
    thumbnail: string;
}

export interface FindByFilterRequest {
    username: string;
    title: string;
    guideTypes: string[];
    rating: number;
}

export interface SaveGuideInfoRequest {
    guideId: string;
    title: string;
    description: string;
    guideTypes: string[];
}

export interface UploadImage {
    title: string;
    description: string;
    guideTypes: string[];
    ingredients: string[];
}