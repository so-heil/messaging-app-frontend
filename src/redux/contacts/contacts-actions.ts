import { AppServices } from "@redux/app-services.interface";
import { AppState } from "@redux/app-state.interface";
import { AppDispatch } from "@redux/dispatch.type";
import { CreateContactDto } from "@services/interfaces/createContact.dro";
import { ContactsActionTypes } from "./contacts-types";

export abstract class contactsActions {
    public static createContact(
        dispatch: AppDispatch,
        dto: CreateContactDto,
    ): Promise<void> {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                _getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                localDispatch({ type: ContactsActionTypes.updating });
                try {
                    const newContact = (await services.users.createContact(dto))
                        .data;

                    localDispatch({
                        type: ContactsActionTypes.updated,
                        payload: newContact,
                    });
                } catch (error) {
                    localDispatch({
                        type: ContactsActionTypes.updateFailed,
                        payload:
                            error.response.data.message ??
                            "No user with this phone number was found.",
                    });
                }
            },
        );
    }
    public static getContacts(dispatch: AppDispatch): Promise<void> {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                _getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                localDispatch({ type: ContactsActionTypes.fetching });
                try {
                    const contacts = (await services.users.getContacts()).data;
                    localDispatch({
                        type: ContactsActionTypes.fetched,
                        payload: contacts,
                    });
                } catch (error) {
                    localDispatch({
                        type: ContactsActionTypes.fetchFailed,
                        payload: error.message ?? "Cannot retrieve contacts",
                    });
                }
            },
        );
    }
}
