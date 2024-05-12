
export interface LoginUserRequest {
    userIdentifier: string;
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
}

export interface Step {
    title: string;
    description: string;
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
    puntuation: number;
}
export interface Guide {
    id: string;
    userid: string;
    title: string;
    description: string;
    published: boolean;
    creationData: string;
    steps: Step[];
    guideTypes: string[];
    checkList: string[];
    comments: string[];
    ratings: Rating[];
}