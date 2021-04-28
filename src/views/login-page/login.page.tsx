import React, { PureComponent } from "react";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import { TextField } from "@material-ui/core";
import countries from "@public/countries.json";
import CountryPicker from "./components/country-picker.component";
import { Country } from "src/common/interfaces/Country";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import firebase from "firebase";
import { auth } from "src/config/firebase.config";
import { AiOutlineLoading } from "react-icons/ai";
import { AppState } from "@redux/app-state.interface";
import { AppDispatch } from "@redux/dispatch.type";
import { UserDto } from "@services/interfaces/User.dto";
import { connect } from "react-redux";
import { AuthRequestDto } from "@services/interfaces/AuthRequest.dto";
import { authActions } from "@redux/auth/auth-actions";
import LoginRedictor from "./components/login-redirector";
import Modal from "@components/modal";
import LoginStep from "./components/step.component";
import { LoginDto } from "@services/interfaces/Login.dto";
import { Step } from "@redux/auth/auth-types";
import ImagePicker from "@components/image-picker/image-picker.component";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OwnProps {}
interface StateProps {
    user: UserDto | null;
    isLoading: boolean;
    errorMessage?: string;
    step: Step;
}
interface DispatchProps {
    register: (dto: AuthRequestDto) => void;
    login: (dto: LoginDto) => void;
    checkIdentity: () => void;
    changeStep: (step: Step) => void;
}
type LoginPageProps = OwnProps & StateProps & DispatchProps;
interface LoginPageState {
    selectedCountry?: Country;
    isModalOpen: boolean;
    phoneNumber: string;
    recaptchaVerifier?: firebase.auth.RecaptchaVerifier;
    loading: boolean;
    authenticator?: firebase.auth.ConfirmationResult;
    codeSent: boolean;
    dialCode: string;
    code: string;
    error?: string;
    token?: string;
    file?: File;
    url?: string;
    imageLoading: boolean;
    name: string;
}

class LoginPage extends PureComponent<LoginPageProps, LoginPageState> {
    private font = { fontSize: 13 };

    public constructor(props: LoginPageProps) {
        super(props);
        this.state = {
            selectedCountry: countries[233],
            isModalOpen: false,
            phoneNumber: "",
            loading: false,
            codeSent: false,
            dialCode: countries[233].dialCode,
            code: "",
            imageLoading: false,
            name: "",
        };
    }

    public componentDidMount() {
        this.props.checkIdentity();
    }

    public render(): JSX.Element {
        const step = this.props.step;
        const isLoading = this.props.isLoading || this.state.loading;

        return (
            <div>
                <header className="bg-gray-800 h-36 sm:h-60" />
                <main className="flex justify-center -mt-32">
                    <div id="recaptcha-container" />
                    <form
                        className="container max-w-sm sm:w-full"
                        onSubmit={this.handleFormSubmit}
                    >
                        <header className="flex justify-between px-4">
                            <div className="flex items-center">
                                <figure className="pr-4">
                                    <Image
                                        src="/icons/telegram-logo.svg"
                                        alt="telegram logo"
                                        width="26"
                                        height="26"
                                    />
                                </figure>
                                <p className="text-white text-sm font-normal">
                                    Tel Geraam
                                </p>
                            </div>
                            <button
                                disabled={isLoading}
                                className="text-white text-sm font-semibold flex items-center cursor-pointer"
                                type="submit"
                            >
                                {this.state.loading ? (
                                    <AiOutlineLoading className="animate-spin" />
                                ) : (
                                    <>
                                        Next
                                        <FiChevronRight
                                            fontSize={20}
                                            fontWeight="800"
                                        />
                                    </>
                                )}
                            </button>
                        </header>
                        <SwitchTransition mode="out-in">
                            <CSSTransition
                                key={this.props.step}
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
                                    {step === "First"
                                        ? this.renderFirstStep()
                                        : step === "Second"
                                        ? this.renderSecondStep()
                                        : this.renderThirdStep()}
                                </div>
                            </CSSTransition>
                        </SwitchTransition>
                        <footer>
                            <p className="text-gray-400 text-sm mt-4 text-center font-semibold px-6">
                                Welcome to Telegram clone made by @so-heil.
                            </p>
                        </footer>
                    </form>
                </main>
                <LoginRedictor user={this.props.user} />
            </div>
        );
    }

    private renderFirstStep = () => (
        <LoginStep
            title="Sign In"
            description="Please choose your country and enter your full phone number."
            extra="Please enter your real number to login, or enter +1 2345678910 to
                test the app."
        >
            <TextField
                label="Country"
                className="w-full"
                value={this.state.selectedCountry?.name ?? "Unknown"}
                onClick={() => this.setState({ isModalOpen: true })}
                InputLabelProps={{ style: { ...this.font } }}
                InputProps={{
                    readOnly: true,
                    style: {
                        ...this.font,
                    },
                }}
            />
            <Modal isOpen={this.state.isModalOpen} onClose={this.closeModal}>
                <CountryPicker
                    onClose={this.closeModal}
                    onCountrySelect={this.selectCountry}
                />
            </Modal>
            <div className="flex justify-between mt-4">
                <TextField
                    label="Code"
                    value={this.state.dialCode}
                    onChange={this.findCountryByCode}
                    className="w-2/12"
                    InputLabelProps={{
                        style: { ...this.font },
                    }}
                    InputProps={{
                        style: { ...this.font },
                    }}
                />
                <TextField
                    InputLabelProps={{
                        style: { ...this.font },
                    }}
                    InputProps={{
                        style: { ...this.font },
                    }}
                    value={this.state.phoneNumber}
                    onChange={(e) =>
                        this.setState({
                            phoneNumber: e.target.value,
                        })
                    }
                    label="Phone number"
                    className="w-9/12"
                    error={!!this.state.error}
                    helperText={this.state.error}
                />
            </div>
        </LoginStep>
    );

    private handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { step } = this.props;
        return step === "First"
            ? this.renderAndVerifyCaptcha()
            : step === "Second"
            ? this.confirmCode()
            : this.backendAuth();
    };

    private renderSecondStep = () => {
        const error = this.state.error ?? this.props.errorMessage;
        return (
            <LoginStep
                title={`${this.state.selectedCountry?.dialCode} ${this.state.phoneNumber}`}
                description="We've sent an SMS containing the code to your phone. Please
                    enter the code below. (000000 for test)"
            >
                <TextField
                    InputLabelProps={{
                        style: { ...this.font },
                    }}
                    InputProps={{
                        style: { ...this.font },
                    }}
                    value={this.state.code}
                    onChange={(e) =>
                        this.setState({
                            code: e.target.value,
                        })
                    }
                    label="Enter your code"
                    className="w-full"
                    error={!!error}
                    helperText={error}
                />
            </LoginStep>
        );
    };

    private renderThirdStep = () => {
        return (
            <LoginStep
                title="Your Info"
                description="Set a nickname, and upload a profile picture (optional) for
                yourself."
            >
                <ImagePicker
                    url={this.state.url}
                    onUploaded={(url) => this.setState({ url })}
                />
                <TextField
                    InputLabelProps={{
                        style: { ...this.font },
                    }}
                    InputProps={{
                        style: { ...this.font },
                    }}
                    required
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                    label="Nickname"
                    className="w-full"
                />
            </LoginStep>
        );
    };

    private findCountryByCode = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        const dialCode = e.target.value;
        const query = !dialCode.includes("+") ? `+${dialCode}` : dialCode;
        const selectedCountry = countries.find(
            (country) => country.dialCode === query,
        );
        this.setState({ selectedCountry, dialCode });
    };

    private closeModal = () => this.setState({ isModalOpen: false });

    private selectCountry = (selectedCountry: Country) =>
        this.setState({
            isModalOpen: false,
            selectedCountry,
            dialCode: selectedCountry.dialCode,
        });

    private renderAndVerifyCaptcha = async () => {
        this.setState({ loading: true });
        let isExpired = false;
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible",
                "expired-callback": () => {
                    this.setState(
                        { recaptchaVerifier: undefined },
                        this.renderAndVerifyCaptcha,
                    );
                    isExpired = true;
                },
            },
        );
        if (!this.state.recaptchaVerifier && !isExpired) {
            recaptchaVerifier
                .render()
                .then(() => {
                    this.setState(
                        { recaptchaVerifier, error: undefined },
                        this.authenticate,
                    );
                })
                .catch(() => {
                    this.setState({
                        error: "Recaptcha Verification Failed",
                        loading: false,
                    });
                });
        } else {
            this.authenticate();
        }
    };

    private authenticate = async () => {
        if (
            !!this.state.selectedCountry &&
            !!this.state.phoneNumber.trim() &&
            this.state.recaptchaVerifier
        ) {
            const phoneNumber =
                this.state.selectedCountry.dialCode + this.state.phoneNumber;
            const appVerifier = this.state.recaptchaVerifier;
            try {
                const authenticator = await auth.signInWithPhoneNumber(
                    phoneNumber,
                    appVerifier,
                );
                this.setState({
                    authenticator,
                    codeSent: true,
                    loading: false,
                    error: undefined,
                });
                this.props.changeStep("Second");
            } catch (error) {
                this.setState({
                    error: error.message ?? "Invalid Phone Number",
                    loading: false,
                });
            }
        } else {
            this.setState({
                error: "Invalid Country Code or Phone Number",
                loading: false,
            });
        }
    };

    private confirmCode = async () => {
        this.setState({ loading: true });
        if (this.state.authenticator) {
            try {
                await this.state.authenticator.confirm(this.state.code);
                const token = await firebase
                    .auth()
                    .currentUser?.getIdToken(true);
                if (token) {
                    this.props.login({ token });

                    this.setState({
                        loading: false,
                        error: undefined,
                        token,
                    });
                }
            } catch (error) {
                this.setState({
                    error: error.message ?? "Cannot Verify Code",
                    loading: false,
                });
            }
        }
    };

    private backendAuth = () => {
        const {
            token,
            selectedCountry,
            phoneNumber: phone,
            url: photo_url,
            name: display_name,
        } = this.state;
        this.setState({ loading: true, error: undefined });
        if (
            token &&
            selectedCountry &&
            phone &&
            display_name &&
            this.props.register
        ) {
            this.props.register({
                display_name,
                phone: `${this.state.selectedCountry?.dialCode} ${this.state.phoneNumber}`,
                photo_url,
                token,
            });
        } else {
            this.setState({
                loading: false,
                error: "We cant verify your info",
            });
        }
    };
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        user: state.auth.user,
        isLoading: state.auth.loading === true,
        errorMessage: state.auth.errorMessage,
        step: state.auth.step,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
    return {
        register: (dto) => authActions.register(dispatch, dto),
        checkIdentity: () => authActions.checkIdentity(dispatch),
        login: (dto) => authActions.login(dispatch, dto),
        changeStep: (step) => authActions.changeStep(dispatch, step),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
