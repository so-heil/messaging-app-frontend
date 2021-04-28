import ProfilePicture from "@components/profile-picture";
import classNames from "classnames";
import React, { PureComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MdAddAPhoto } from "react-icons/md";
import { storage } from "src/config/firebase.config";

interface Props {
    url?: string;
    onUploaded: (url: string) => void;
    className?: string;
}
interface State {
    imageLoading: boolean;
    file?: File;
    error?: string;
    hovered: boolean;
}

class ImagePicker extends PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            imageLoading: false,
            hovered: false,
        };
    }

    public render(): JSX.Element {
        return (
            <div
                className={classNames(
                    "w-full flex justify-center items-center flex-col",
                    this.props.className,
                )}
            >
                {!this.props.url ? (
                    <label
                        htmlFor="profile-picture-picker"
                        className="
                                h-36 w-36 rounded-full
                                flex justify-center items-center cursor-pointer
                                border-2 border-gray-300 border-dashed"
                    >
                        <p className="text-xs text-gray-400 flex items-end">
                            {this.state.imageLoading ? (
                                <AiOutlineLoading
                                    className="animate-spin"
                                    size={20}
                                />
                            ) : (
                                <>
                                    <MdAddAPhoto size={20} className="mr-1" />
                                    Select Image
                                </>
                            )}
                        </p>
                    </label>
                ) : (
                    <label
                        htmlFor="profile-picture-picker"
                        className="relative"
                        onMouseEnter={() => this.setState({ hovered: true })}
                        onMouseLeave={() => this.setState({ hovered: false })}
                    >
                        <div
                            className={classNames(
                                "absolute w-full h-full rounded-full flex justify-center items-center cursor-pointer transition",
                                {
                                    "bg-gray-900 bg-opacity-60": this.state
                                        .hovered,
                                    "opacity-0": !this.state.hovered,
                                },
                            )}
                        >
                            <p className="text-xs text-gray-400 flex items-end">
                                {this.state.imageLoading ? (
                                    <AiOutlineLoading
                                        className="animate-spin"
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <MdAddAPhoto
                                            size={20}
                                            className="mr-1"
                                        />
                                        Select Image
                                    </>
                                )}
                            </p>
                        </div>
                        <ProfilePicture
                            src={this.props.url}
                            size={139}
                            key={this.props.url}
                            className="z-0"
                        />
                    </label>
                )}
                {this.state.error && (
                    <p className="text-red-600 text-xs w-64 text-center">
                        {this.state.error}
                    </p>
                )}
                <input
                    type="file"
                    className="hidden max-w-0 max-h-0 opacity-0"
                    id="profile-picture-picker"
                    onChange={this.handleImageUpload}
                />
            </div>
        );
    }

    private handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target?.files;
        const filePath = e.target.value;
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

        if (fileList) {
            const image = fileList[0];
            if (!allowedExtensions.exec(filePath)) {
                this.setState({ error: "Please select an image." });
            } else {
                this.setState({ file: image, imageLoading: true });

                const uploadTask = storage
                    .ref(`profile-images/${image.name}`)
                    .put(image);

                uploadTask.on(
                    "state_changed",
                    console.log,
                    console.error,
                    () => {
                        storage
                            .ref("profile-images")
                            .child(image.name)
                            .getDownloadURL()
                            .then((url) => {
                                this.setState({
                                    imageLoading: false,
                                    error: undefined,
                                });
                                this.props.onUploaded(url);
                            })
                            .catch(console.log);
                    },
                );
            }
        }
    };
}

export default ImagePicker;
