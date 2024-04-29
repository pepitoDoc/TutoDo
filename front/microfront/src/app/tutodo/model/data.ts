import { FormControl } from "@angular/forms"

export interface LoginUserRequest {
    userIdentifier: string,
    password: string
}

export interface InsertUserRequest {
    username: string,
    email: string,
    password: string
}