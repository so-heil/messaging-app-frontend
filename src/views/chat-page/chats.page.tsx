import { AppState } from "@redux/app-state.interface";
import { AppDispatch } from "@redux/dispatch.type";
import { UserDto } from "@services/interfaces/User.dto";
import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import ChatMessages from "./components/chat-messages.component";
import ChatSidebar from "./components/chat-sidebar.component";
import NextError from "next/error";
import { authActions } from "@redux/auth/auth-actions";
import { AiOutlineLoading } from "react-icons/ai";
import Media from "react-media";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OwnProps {}
interface StateProps {
    user: UserDto | null;
    isLoading: boolean;
    selectedChat?: string;
}
interface DispatchProps {
    checkId: () => void;
}
type ChatPageProperties = StateProps & DispatchProps & OwnProps;

class ChatPage extends PureComponent<ChatPageProperties, unknown> {
    public componentDidMount() {
        this.props.checkId();
    }

    public render(): JSX.Element {
        const user = this.props.user;

        if (!user) {
            return this.props.isLoading ? (
                <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
                    <AiOutlineLoading
                        className="animate-spin text-white"
                        size={45}
                    />
                </div>
            ) : (
                <NextError
                    statusCode={401}
                    title="Please login to your account to access this page"
                />
            );
        }
        return (
            <div className="h-screen flex">
                <Media
                    query="(max-width: 767px)"
                    render={() => (
                        <Fragment>
                            {this.props.selectedChat ? (
                                <ChatMessages />
                            ) : (
                                <ChatSidebar />
                            )}
                        </Fragment>
                    )}
                />
                <Media
                    query="(min-width: 768px)"
                    render={() => (
                        <Fragment>
                            <ChatSidebar />
                            <ChatMessages />
                        </Fragment>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        user: state.auth.user,
        isLoading: !!state.auth.loading,
        selectedChat: state.chats.selectedChat,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
    return {
        checkId: () => authActions.checkIdentity(dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
