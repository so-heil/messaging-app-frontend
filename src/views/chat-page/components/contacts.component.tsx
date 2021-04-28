import Modal from "@components/modal";
import ProfilePicture from "@components/profile-picture";
import { AppState } from "@redux/app-state.interface";
import { contactsActions } from "@redux/contacts/contacts-actions";
import { AppDispatch } from "@redux/dispatch.type";
import { ContactDto } from "@services/interfaces/Contact.dto";
import { CreateContactDto } from "@services/interfaces/createContact.dro";
import React, { PureComponent } from "react";
import { AiOutlineLoading, AiOutlineUserAdd } from "react-icons/ai";
import { connect } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OwnProps {}
interface StateProps {
    contacts: ContactDto[];
    isLoading: boolean;
    error?: string;
}
interface DispatchProps {
    getContacts: () => void;
    createContacts: (dto: CreateContactDto) => void;
}
type Props = OwnProps & StateProps & DispatchProps;
interface State {
    isModalOpen: boolean;
    first: string;
    last: string;
    phone: string;
    error?: string;
}

class Contacts extends PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            isModalOpen: false,
            first: "",
            last: "",
            phone: "",
        };
    }

    public componentDidMount() {
        this.props.getContacts();
    }

    public render(): JSX.Element {
        const { contacts } = this.props;
        return (
            <div>
                <div
                    className="flex items-center text-blue-400 border-b border-gray-800 py-2 cursor-pointer"
                    onClick={() => this.setState({ isModalOpen: true })}
                >
                    <AiOutlineUserAdd size={27} className="mx-3" />
                    <p className="text-sm">Add Contact</p>
                </div>
                <p className="p-2 text-xs text-blue-400 text-center">
                    You can add anyone on this app by their phone number to your
                    contacts.
                </p>
                {contacts.map(this.renderContact)}
                {this.renderModal()}
            </div>
        );
    }

    private renderContact = (contact: ContactDto): JSX.Element => (
        <div className="flex py-1 border-b border-gray-800" key={contact.id}>
            <ProfilePicture className="px-2" />
            <div>
                <h3 className="text-white text-sm leading-loose">
                    {contact.name}
                </h3>
                <p className="text-gray-400 text-xs">last seen recently</p>
            </div>
        </div>
    );

    private renderModal = () => {
        const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
            className: "bg-transparent text-xs p-3 text-white w-64",
            type: "text",
        };
        const error = this.state.error ?? this.props.error;
        return (
            <Modal
                isOpen={this.state.isModalOpen}
                onClose={this.closeModal}
                className="bg-gray-900 rounded-2xl"
            >
                <form>
                    <header className="py-3 text-white text-sm text-center">
                        Add Contact
                    </header>
                    <main className="p-8 bg-black">
                        <div className="flex flex-col bg-gray-900 rounded-xl">
                            <input
                                {...inputProps}
                                placeholder="First Name"
                                value={this.state.first}
                                onChange={(e) =>
                                    this.setState({ first: e.target.value })
                                }
                            />
                            <input
                                {...inputProps}
                                placeholder="Last Name"
                                value={this.state.last}
                                onChange={(e) =>
                                    this.setState({ last: e.target.value })
                                }
                            />
                            <input
                                {...inputProps}
                                placeholder="Phone Number"
                                value={this.state.phone}
                                onChange={(e) =>
                                    this.setState({ phone: e.target.value })
                                }
                            />
                        </div>
                        {error && (
                            <p className="text-red-600 text-xs w-64">{error}</p>
                        )}
                    </main>
                    <button
                        disabled={this.props.isLoading}
                        className="text-blue-400 text-center h-10 text-sm flex justify-center items-center w-full"
                        onClick={this.createContact}
                    >
                        {this.props.isLoading ? (
                            <AiOutlineLoading className="animate-spin" />
                        ) : (
                            "OK"
                        )}
                    </button>
                </form>
            </Modal>
        );
    };

    private createContact = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (this.state.phone.trim() && this.state.first.trim()) {
            this.setState({
                error: undefined,
            });
            this.props.createContacts({
                name: this.state.first + " " + this.state.last,
                phone: this.state.phone,
            });
        } else {
            this.setState({
                error: "First Name and Phone Number Fields Cannot be empty.",
            });
        }
    };

    private closeModal = () => {
        this.setState({
            first: "",
            last: "",
            isModalOpen: false,
            phone: "",
            error: undefined,
        });
    };
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        contacts: state.contacts.contacts ?? [],
        isLoading: !!state.contacts.loading,
        error: state.contacts.errorMessage,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
    return {
        getContacts: () => contactsActions.getContacts(dispatch),
        createContacts: (dto) => contactsActions.createContact(dispatch, dto),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
