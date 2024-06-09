
export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface InsertUserRequest {
    username: string;
    email: string;
    password: string;
    preferences: string[];
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
    image: string;
}

export interface FormStep {
    title: string;
    description: string;
    imageFileInput: File | null;
    imageBase64: string;
    loadedImage: string | ArrayBuffer | null;
    imageFile: File | null;
    saved: boolean;
    modifying: boolean;
}

export interface SaveGuideStepsRequest {
    guideId: string;
    steps: Step[];
    published: boolean;
}

export interface SaveGuideStepRequest {
    guideId: string;
    title: string;
    description: string;
    image?: string;
    stepIndex: number;
    saved: boolean;
}

export interface DeleteGuideStepRequest {
    guideId: string;
    stepIndex: number;
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
    creationDate: Date;
    steps: Step[];
    guideTypes: string[];
    ingredients: string[];
    comments: Comment[];
    ratings: Rating[];
    thumbnail: string;
}

export interface Comment {
    userId: string;
    username: string;
    text: string;
    date: Date;
    formattedDate: Date;
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
    ingredients: string[];
    published: boolean;
    thumbnail: string;
}

export interface LoadedImage {
    index: number;
    image: string | ArrayBuffer | null;
}

export interface StepSnapshot {
    title: string;
    description: string;
    imageBase64: string;
    loadedImage: string | ArrayBuffer | null;
    imageFile: File | null;
    index: number;
}

export interface GuideInfoSnapshot {
    title: string;
    description: string;
    guideTypes: string[];
    ingredients: string[];
    imageBase64: string;
    imageFile: File | null;
    isPublished: boolean;
    loadedImage: string | ArrayBuffer | null;
}

export interface AddRatingRequest {
    guideId: string;
    punctuation: number;
}

export interface AddCommentRequest {
    guideId: string;
    comment: string;
}

export interface AddCommentResponse {
    result: string;
    comment: Comment;
}

export interface DeleteCommentRequest {
    guideId: string;
    userId: string;
    username: string;
    text: string;
    date: Date;
}

export interface FindByFilterResponse {
    guideFound: Guide;
    creatorUsername: string;
}