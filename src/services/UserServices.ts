import { AxiosResponse } from "axios";
import { api } from "./config/axios.config";
import { ContactDto } from "./interfaces/Contact.dto";
import { CreateContactDto } from "./interfaces/createContact.dro";

export default class UsersServices {
    public async getContacts(): Promise<AxiosResponse<ContactDto[]>> {
        return await api.request({
            method: "GET",
            url: "/users/contacts",
        });
    }

    public async createContact(
        data: CreateContactDto,
    ): Promise<AxiosResponse<ContactDto>> {
        return await api.request({
            method: "POST",
            url: "/users/contacts",
            data,
        });
    }
}
