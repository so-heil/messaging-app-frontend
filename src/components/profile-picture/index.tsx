import React, { PureComponent } from "react";
import classNames from "classnames";
import Skeleton from "@material-ui/lab/Skeleton";

interface Props {
    size?: number;
    src?: string;
    className?: string;
}
interface State {
    loading: boolean;
}

class ProfilePicture extends PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    public render(): JSX.Element {
        const { className, size, src } = this.props;
        return (
            <figure className={className}>
                {this.state.loading && (
                    <Skeleton
                        variant="circle"
                        height={size ?? 42}
                        width={size ?? 42}
                        style={{ background: "#1F2937" }}
                    />
                )}
                <img
                    src={src ?? "/profile-pic.png"}
                    alt="Profile Picture"
                    onLoad={() => this.setState({ loading: false })}
                    style={{
                        width: size ?? 42,
                        height: size ?? 42,
                    }}
                    className={classNames("rounded-full object-cover", {
                        hidden: this.state.loading,
                    })}
                />
            </figure>
        );
    }
}

export default ProfilePicture;
