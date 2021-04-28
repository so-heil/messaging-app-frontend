import ImagePicker from "@components/image-picker/image-picker.component";
import { TextField } from "@material-ui/core";
import { AppState } from "@redux/app-state.interface";
import { authActions } from "@redux/auth/auth-actions";
import { AppDispatch } from "@redux/dispatch.type";
import { UpdateProfileDto } from "@services/interfaces/updateProfile.dto";
import { UserDto } from "@services/interfaces/User.dto";
import React, { PureComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { connect } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OwnProps {}
interface StateProps {
    user: UserDto | null;
    isLoading: boolean;
}
interface DispatchProps {
    updateProfile: (dto: UpdateProfileDto) => void;
}
type Props = StateProps & DispatchProps & OwnProps;
interface State {
    url: string | undefined;
    name: string;
    error?: string;
}

class Settings extends PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            url: this.props.user?.photo_url,
            name: this.props.user?.display_name ?? "",
        };
    }

    public render(): JSX.Element {
        return (
            <div className="flex flex-col justify-center items-center h-full">
                <ImagePicker
                    url={this.state.url}
                    onUploaded={(url) => this.setState({ url })}
                    className="my-10"
                />
                <TextField
                    InputLabelProps={{
                        style: { fontSize: 13, color: "#FFF" },
                    }}
                    InputProps={{
                        style: { fontSize: 13, color: "#FFF" },
                    }}
                    required
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                    label="Nickname"
                    error={!!this.state.error}
                    helperText={this.state.error}
                    className="w-4/5"
                />
                <button
                    className="text-blue-400 border border-blue-400
                               text-xs py-2 w-4/5 rounded-full mt-10
                               hover:bg-blue-400 hover:text-white transition
                               flex justify-center items-center"
                    onClick={this.updateProfile}
                    disabled={this.props.isLoading}
                >
                    {this.props.isLoading ? (
                        <AiOutlineLoading className="animate-spin" size={14} />
                    ) : (
                        "UPDATE"
                    )}
                </button>
            </div>
        );
    }

    private updateProfile = () => {
        const { name, url } = this.state;
        const { updateProfile, user } = this.props;

        if (name) {
            if (name !== user?.display_name || url !== user.photo_url) {
                updateProfile({
                    display_name: name,
                    photo_url: url,
                });
                this.setState({ error: undefined });
            } else {
                this.setState({ error: "Please enter different info" });
            }
        } else {
            this.setState({ error: "Name field cannot be empty." });
        }
    };
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        user: state.auth.user,
        isLoading: !!state.auth.loading,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
    return {
        updateProfile: (dto) => authActions.updateProfile(dispatch, dto),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
