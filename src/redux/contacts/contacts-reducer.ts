import { AnyAction } from "@reduxjs/toolkit";
import { ContactDto } from "@services/interfaces/Contact.dto";
import { ContactsActionTypes, ContactsState } from "./contacts-types";

const initialState: ContactsState = {
    contacts: [],
};

export const contactsReducer = (
    state: ContactsState = initialState,
    action: AnyAction,
): ContactsState => {
    switch (action.type) {
        case ContactsActionTypes.fetching: {
            return {
                ...state,
                loading: true,
            };
        }
        case ContactsActionTypes.fetched: {
            return {
                ...state,
                loading: false,
                contacts: action.payload as ContactDto[],
            };
        }
        case ContactsActionTypes.updating: {
            return {
                ...state,
                loading: true,
                errorMessage: undefined,
            };
        }
        case ContactsActionTypes.updated: {
            return {
                ...state,
                loading: false,
                contacts: [...state.contacts, action.payload as ContactDto],
            };
        }
        case ContactsActionTypes.fetchFailed: {
            return {
                ...state,
                loading: false,
            };
        }
        case ContactsActionTypes.updateFailed: {
            return {
                ...state,
                loading: false,
                errorMessage: action.payload as string,
            };
        }

        default:
            return state;
    }
};
