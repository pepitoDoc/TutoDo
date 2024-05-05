
export interface LoginUserRequest {
    userIdentifier: string,
    password: string
}

export interface InsertUserRequest {
    username: string,
    email: string,
    password: string
}

export interface GuideStep {
    title: string,
    description: string
}