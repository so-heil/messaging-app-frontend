import { ContactDto } from "@services/interfaces/Contact.dto";

export enum ContactsActionTypes {
    fetching = "fetching",
    fetchFailed = "fetchFailed",
    updateFailed = "updateFailed",
    fetched = "fetched",
    updating = "updating",
    updated = "updated",
}
export interface ContactsState {
    contacts: ContactDto[];
    errorMessage?: string;
    loading?: boolean;
}
