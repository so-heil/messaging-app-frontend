import React, { PureComponent } from "react";
import ProfilePicture from "@components/profile-picture";
import { MessageDto } from "@services/interfaces/Message.dto";
import classNames from "classnames";
import { getTime } from "src/utils/getTime";

interface Props {
    message: MessageDto;
    self: boolean;
    isFirst: boolean;
}

class Message extends PureComponent<Props, unknown> {
    public render(): JSX.Element {
        const { message, self, isFirst } = this.props;
        return (
            <div
                className={classNames(
                    "flex my-1 items-end md:px-5 px-2 max-w-lg",
                    {
                        "self-end": self,
                        "mt-auto": isFirst,
                    },
                )}
            >
                {!self && (
                    <ProfilePicture
                        className="pr-2"
                        src={message.user?.photo_url}
                        key={message.id + "profile-pic-message"}
                    />
                )}
                <div
                    className={classNames("px-3 py-2 rounded-2xl", {
                        "bg-gray-800 bubble": !self,
                        "bg-indigo-light self-bubble": self,
                    })}
                >
                    {!self && (
                        <h3 className="text-sm text-blue-400">
                            {message.user?.display_name ?? "User"}
                        </h3>
                    )}
                    <div className="flex justify-end items-end">
                        <p className="text-gray-200 mr-3 text-xs max-w-lg break-normal overflow-hidden">
                            {message?.content}
                        </p>
                        <span
                            className={classNames("text-xs italic", {
                                "text-white": self,
                                "text-gray-400": !self,
                            })}
                            style={{ fontSize: 10 }}
                        >
                            {message.sentAt
                                ? getTime(message.sentAt)
                                : "unknown"}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Message;
