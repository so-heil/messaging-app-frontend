import classNames from "classnames";
import React, { PureComponent } from "react";
import { AiOutlineForm, AiOutlineLoading } from "react-icons/ai";
import { VscSearch } from "react-icons/vsc";
import { HiUserCircle, HiPhone } from "react-icons/hi";
import { IoIosChatbubbles, IoIosSettings } from "react-icons/io";
import { IconBaseProps } from "react-icons/lib";
import ProfilePicture from "@components/profile-picture";
import Menu from "@components/menu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import Modal from "@components/modal";
import { ActiveSidebar } from "./types";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Contacts from "./contacts.component";
import { connect } from "react-redux";
import { AppState } from "@redux/app-state.interface";
import { AppDispatch } from "@redux/dispatch.type";
import { ChatDto } from "@services/interfaces/Chat.dto";
import { CreateChatDto } from "@services/interfaces/createChat.dto";
import { ChatActions } from "@redux/chat/chat-actions";
import ImagePicker from "@components/image-picker/image-picker.component";
import { MessageDto } from "@services/interfaces/Message.dto";
import { getTime } from "src/utils/getTime";
import Settings from "./settings.component";
import Skeleton from "@material-ui/lab/Skeleton";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OwnProps {}
interface StateProps {
    chats: ChatDto[];
    isLoading: boolean;
    error?: string;
    selectedChatId?: string;
}
interface DispatchProps {
    createGroup: (dto: CreateChatDto) => void;
    getChats: () => void;
    selectChat: (chat: ChatDto) => void;
    connect: () => void;
}
type Props = OwnProps & StateProps & DispatchProps;
interface State {
    isSearchFocused: boolean;
    isMenuOpen: boolean;
    activeSidebar: ActiveSidebar;
    error?: string;
    isModalOpen: boolean;
    groupName: string;
    photoUrl?: string;
    query: string;
    filteredChats?: ChatDto[];
}

class ChatSidebar extends PureComponent<Props, State> {
    private footerIconProps: IconBaseProps = {
        className: "text-gray-300 p-2",
        size: 32,
    };

    public constructor(props: Props) {
        super(props);
        this.state = {
            isSearchFocused: false,
            isMenuOpen: false,
            activeSidebar: ActiveSidebar.chats,
            isModalOpen: false,
            groupName: "",
            query: "",
        };
    }

    public componentDidMount() {
        if (!this.props.chats.length) {
            this.props.getChats();
        }
        this.props.connect();
    }

    public render(): JSX.Element {
        const { activeSidebar } = this.state;
        const chats = this.state.filteredChats ?? this.props.chats;

        return (
            <aside
                className="flex flex-col align-center bg-gray-900 h-full w-full md:w-72 border-r border-gray-800"
                onMouseLeave={() => this.setState({ isMenuOpen: false })}
            >
                <header className="flex items-center py-2">
                    <div
                        className={classNames(
                            "flex items-center p-2 my-1 mx-3 bg-gray-700 rounded-md transition delay-75 w-full justify-end",
                        )}
                    >
                        <VscSearch className="text-gray-400" />
                        <input
                            type="text"
                            onFocus={() =>
                                this.setState({ isSearchFocused: true })
                            }
                            onBlur={() =>
                                this.setState({ isSearchFocused: false })
                            }
                            className={classNames(
                                "bg-transparent w-3/5 text-xs px-2 font-medium text-white transition-all delay-75",
                                { "w-full": this.state.isSearchFocused },
                            )}
                            placeholder="Search"
                            value={this.state.query}
                            onChange={this.searchChats}
                        />
                    </div>
                    <div className="relative">
                        <AiOutlineForm
                            onClick={() => this.setState({ isMenuOpen: true })}
                            className={classNames(
                                "transition-all delay-75 p-1 rounded-md",
                                {
                                    "mr-3": !this.state.isSearchFocused,
                                    "max-w-0 opacity-0": this.state
                                        .isSearchFocused,
                                    "bg-blue-400 text-white": this.state
                                        .isMenuOpen,
                                    "text-blue-400": !this.state.isMenuOpen,
                                },
                            )}
                            size={30}
                        />
                        <Menu
                            isOpen={this.state.isMenuOpen}
                            onClose={() => this.setState({ isMenuOpen: false })}
                        >
                            <Menu.Item
                                Icon={AiOutlineUsergroupAdd}
                                title="New Group"
                                isLast
                                isFirst
                                onClick={() =>
                                    this.setState({ isModalOpen: true })
                                }
                            />
                        </Menu>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    <SwitchTransition mode="out-in">
                        <CSSTransition
                            key={this.state.activeSidebar}
                            addEndListener={(node, done) => {
                                node.addEventListener(
                                    "transitionend",
                                    done,
                                    false,
                                );
                            }}
                            classNames="fade"
                            unmountOnExit
                        >
                            <div>
                                {activeSidebar === ActiveSidebar.chats ? (
                                    this.props.isLoading ? (
                                        this.renderChatLoading()
                                    ) : (
                                        chats.map(this.renderChat)
                                    )
                                ) : activeSidebar === ActiveSidebar.contacts ? (
                                    <Contacts />
                                ) : (
                                    <Settings />
                                )}
                            </div>
                        </CSSTransition>
                    </SwitchTransition>
                </main>
                <footer className="flex px-4 py-2 justify-between items-center border-t border-gray-700 border-opacity-50">
                    <HiUserCircle
                        {...this.footerIconProps}
                        onClick={() =>
                            this.changeSidebar(ActiveSidebar.contacts)
                        }
                        className={this.getClassName(ActiveSidebar.contacts)}
                    />
                    <HiPhone
                        {...this.footerIconProps}
                        className={this.getClassName(ActiveSidebar.calls)}
                    />
                    <IoIosChatbubbles
                        {...this.footerIconProps}
                        onClick={() => this.changeSidebar(ActiveSidebar.chats)}
                        className={this.getClassName(ActiveSidebar.chats)}
                    />
                    <IoIosSettings
                        {...this.footerIconProps}
                        onClick={() =>
                            this.changeSidebar(ActiveSidebar.settings)
                        }
                        className={this.getClassName(ActiveSidebar.settings)}
                    />
                </footer>
                {this.renderModal()}
            </aside>
        );
    }

    private renderChat = (chat: ChatDto) => {
        const lastMessage: MessageDto | undefined = chat.messages
            ? chat.messages[chat.messages.length - 1]
            : undefined;
        const isSelected = chat.id === this.props.selectedChatId;
        return (
            <div
                key={chat.id}
                className={classNames("flex cursor-pointer", {
                    "bg-indigo-light": isSelected,
                })}
                onClick={() => this.selectChat(chat)}
            >
                <ProfilePicture
                    key={chat.id + "pic"}
                    size={55}
                    className="p-2"
                    src={chat.photo_url}
                />
                <div className="flex flex-col py-2 flex-1 pr-3 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white text-sm font-medium leading-loose">
                            {chat.display_name}
                        </h3>
                        <p
                            className={classNames(
                                "text-light font-extralight italic",
                                {
                                    "text-white": isSelected,
                                    "text-gray-400": !isSelected,
                                },
                            )}
                            style={{ fontSize: 10 }}
                        >
                            {lastMessage?.sentAt
                                ? getTime(lastMessage?.sentAt)
                                : "unknown"}
                        </p>
                    </div>
                    <p
                        className={classNames("text-xs font-extralight", {
                            "text-white": isSelected,
                            "text-gray-400": !isSelected,
                        })}
                    >
                        {lastMessage?.content.slice(0, 25) ?? "No message yet."}
                    </p>
                </div>
            </div>
        );
    };

    private renderChatLoading = () => {
        const arr = [0, 1, 2, 3, 4];
        return (
            <>
                {arr.map((index) => (
                    <div
                        className="flex items-center w-full"
                        key={`loading-chat-${index}`}
                    >
                        <Skeleton
                            variant="circle"
                            width={70}
                            height={60}
                            style={{ background: "#1F2937", margin: 10 }}
                        />
                        <div className="w-full">
                            <Skeleton
                                variant="text"
                                width="30%"
                                style={{ background: "#1F2937" }}
                            />
                            <Skeleton
                                variant="text"
                                width="80%"
                                style={{ background: "#1F2937" }}
                            />
                        </div>
                    </div>
                ))}
            </>
        );
    };

    private selectChat = (chat: ChatDto) => {
        if (
            chat.id &&
            this.props.selectChat &&
            chat.id !== this.props.selectedChatId
        ) {
            this.props.selectChat(chat);
        }
    };

    private searchChats = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        const filteredChats = this.props.chats?.filter((chat) =>
            chat.display_name.toLowerCase().includes(query.toLowerCase()),
        );
        this.setState({ query, filteredChats });
    };

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
                        Create New Group
                    </header>
                    <main className="p-8 bg-black">
                        <ImagePicker
                            className="mb-4"
                            url={this.state.photoUrl}
                            onUploaded={(url) =>
                                this.setState({ photoUrl: url })
                            }
                        />
                        <div className="flex flex-col bg-gray-900 rounded-xl">
                            <input
                                {...inputProps}
                                placeholder="Group Name"
                                value={this.state.groupName}
                                onChange={(e) =>
                                    this.setState({ groupName: e.target.value })
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
                        onClick={this.createGroup}
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

    private createGroup = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (this.state.groupName.trim()) {
            this.setState({ error: undefined });
            this.props.createGroup({
                name: this.state.groupName,
                photo_url: this.state.photoUrl,
            });
        } else {
            this.setState({ error: "Name field cannot be empty." });
        }
    };

    private closeModal = () => {
        this.setState({ isModalOpen: false, error: undefined });
    };

    private changeSidebar = (activeSidebar: ActiveSidebar) =>
        this.setState({ activeSidebar });

    private getClassName = (activeSidebar: ActiveSidebar): string => {
        const isActive = this.state.activeSidebar === activeSidebar;
        return classNames({
            "text-blue-400": isActive,
            "text-gray-300": !isActive,
        });
    };
}
const mapStateToProps = (state: AppState): StateProps => {
    return {
        chats: state.chats.chats ?? [],
        isLoading: !!state.chats.loading,
        error: state.chats.error,
        selectedChatId: state.chats.selectedChat,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
    return {
        createGroup: (dto) => ChatActions.createChat(dispatch, dto),
        getChats: () => ChatActions.getChats(dispatch),
        selectChat: (chat) => ChatActions.selectChat(dispatch, chat),

        connect: () => ChatActions.Connect(dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatSidebar);
