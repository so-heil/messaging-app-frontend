import React, { PureComponent } from "react";
import ProfilePicture from "@components/profile-picture";
import Message from "./message.component";
import { CgSmileMouthOpen } from "react-icons/cg";
import { IoMicOutline } from "react-icons/io5";
import { AppState } from "@redux/app-state.interface";
import { AppDispatch } from "@redux/dispatch.type";
import { connect } from "react-redux";
import { ChatDto } from "@services/interfaces/Chat.dto";
import { ChatActions } from "@redux/chat/chat-actions";
import { SendMessageDto } from "@services/interfaces/sendMessageDto";
import Skeleton from "@material-ui/lab/Skeleton";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OwnProps {}
interface StateProps {
    isLoading: boolean;
    chat?: ChatDto;
    userId?: string;
}
interface DispatchProps {
    sendMessage: (dto: SendMessageDto) => void;
}
type Props = StateProps & DispatchProps & OwnProps;
interface State {
    message: string;
}

class ChatMessages extends PureComponent<Props, State> {
    private messagesRef: React.RefObject<HTMLElement> = React.createRef();

    public constructor(props: Props) {
        super(props);
        this.state = {
            message: "",
        };
    }

    public componentDidMount() {
        this.scrollToBottom();
    }

    public componentDidUpdate() {
        this.scrollToBottom();
    }

    public render(): JSX.Element {
        const { chat, userId } = this.props;
        return (
            <div className="h-full bg-gray-900 flex-1 flex flex-col">
                {chat ? (
                    <>
                        <header className="flex py-1 border-b border-gray-800">
                            <ProfilePicture
                                key={chat.id + "group pic"}
                                className="pl-5 pr-2"
                                src={chat.photo_url}
                            />
                            <div>
                                <h3 className="text-white text-sm leading-loose">
                                    {chat.display_name}
                                </h3>
                                <p className="text-gray-400 text-xs">
                                    last seen recently
                                </p>
                            </div>
                        </header>
                        <main
                            className="flex flex-1 overflow-y-auto flex-col"
                            ref={this.messagesRef}
                        >
                            {this.props.isLoading
                                ? this.renderChatLoading()
                                : chat.messages
                                ? chat.messages.map((message, i) => (
                                      <Message
                                          isFirst={i === 0}
                                          message={message}
                                          self={message.user?.id === userId}
                                          key={message.id}
                                      />
                                  ))
                                : this.renderChatLoading()}
                        </main>
                        <form
                            className="py-2 border-t border-gray-800 flex items-center px-4"
                            onSubmit={this.sendMessage}
                        >
                            <input
                                value={this.state.message}
                                onChange={(e) =>
                                    this.setState({ message: e.target.value })
                                }
                                type="text"
                                className="w-full bg-transparent text-white text-xs"
                                placeholder="Write a message..."
                            />
                            <CgSmileMouthOpen
                                className="text-gray-400"
                                size={32}
                            />
                            <IoMicOutline
                                className="text-gray-400 ml-4"
                                size={32}
                            />
                        </form>
                    </>
                ) : (
                    <h3 className="text-gray-400 m-auto text-xs">
                        Select a chat to start messaging.
                    </h3>
                )}
            </div>
        );
    }
    private sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (this.state.message.trim() && this.props.chat?.id) {
            this.props.sendMessage({
                chatId: this.props.chat.id,
                message: this.state.message,
            });
            this.setState({ message: "" });
        }
    };
    private renderChatLoading = () => {
        const arr = [0, 1, 2, 3, 4, 5, 6, 7];
        return (
            <>
                {arr.map((index) => (
                    <div
                        className="flex flex-col"
                        key={`loader-message-${index}`}
                    >
                        <div className="flex items-center w-full">
                            <Skeleton
                                variant="circle"
                                width={48}
                                height={42}
                                style={{
                                    background: "#1F2937",
                                    marginLeft: 20,
                                    marginRight: 8,
                                }}
                            />
                            <div className="w-full">
                                <Skeleton
                                    variant="text"
                                    width={70}
                                    style={{ background: "#1F2937" }}
                                />
                                <Skeleton
                                    variant="text"
                                    width={200}
                                    style={{ background: "#1F2937" }}
                                />
                            </div>
                        </div>
                        <Skeleton
                            variant="text"
                            width={200}
                            style={{
                                background: "#1F2937",
                                marginTop: 8,
                                alignSelf: "flex-end",
                                marginRight: 22,
                                marginBottom: 8,
                            }}
                        />
                    </div>
                ))}
            </>
        );
    };

    private scrollToBottom = () => {
        if (this.messagesRef.current) {
            const scrollHeight = this.messagesRef.current.scrollHeight;
            const height = this.messagesRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            this.messagesRef.current.scrollTop =
                maxScrollTop > 0 ? maxScrollTop : 0;
        }
    };
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        chat: state.chats.chats.find(
            (chat) => chat.id === state.chats.selectedChat,
        ),
        isLoading: !!state.chats.messagesLoading,
        userId: state.auth.user?.id,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
    return {
        sendMessage: (dto) => ChatActions.sendMessage(dispatch, dto),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages);
