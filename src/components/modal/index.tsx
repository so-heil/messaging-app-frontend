import classNames from "classnames";
import React, { PureComponent } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { CSSTransition } from "react-transition-group";
interface ModalProperties {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

class Modal extends PureComponent<ModalProperties, unknown> {
    public constructor(props: ModalProperties) {
        super(props);
        this.state = {};
    }

    public render(): JSX.Element {
        const { children, onClose, isOpen, className } = this.props;
        return (
            <CSSTransition
                in={isOpen}
                timeout={100}
                classNames="fade"
                unmountOnExit
            >
                <>
                    <div
                        className="absolute w-full h-full bg-black z-40 inset-0 bg-opacity-70"
                        onClick={() => onClose()}
                    />
                    <AiOutlineClose
                        className="text-gray-400 z-50 absolute hover:text-white transition delay-70 cursor-pointer"
                        style={{ top: 40, right: 40 }}
                        size={30}
                        onClick={() => onClose()}
                    />
                    <div
                        className={classNames("absolute z-50", className)}
                        style={{
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    >
                        {children}
                    </div>
                </>
            </CSSTransition>
        );
    }
}

export default Modal;
