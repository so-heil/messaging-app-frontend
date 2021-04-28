import { AxiosResponse } from "axios";
import { api } from "./config/axios.config";
import { AuthRequestDto } from "./interfaces/AuthRequest.dto";
import { LoginDto } from "./interfaces/Login.dto";
import { UpdateProfileDto } from "./interfaces/updateProfile.dto";
import { UserDto } from "./interfaces/User.dto";

export default class AuthServices {
    public async register(
        data: AuthRequestDto,
    ): Promise<AxiosResponse<UserDto>> {
        return await api.request({
            method: "POST",
            url: "/users/register",
            data,
        });
    }

    public async login(data: LoginDto): Promise<AxiosResponse<UserDto>> {
        return await api.request({
            method: "POST",
            url: "/users/login",
            data,
        });
    }

    public async checkIdentity(): Promise<AxiosResponse<UserDto>> {
        return await api.request({
            method: "GET",
            url: "/users/check",
        });
    }

    public async update(
        data: UpdateProfileDto,
    ): Promise<AxiosResponse<UserDto>> {
        return await api.request({
            method: "POST",
            url: "/users/update",
            data,
        });
    }
}
