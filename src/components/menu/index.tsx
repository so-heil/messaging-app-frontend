import classNames from "classnames";
import React, { PureComponent } from "react";
import { IconType } from "react-icons/lib";
import { CSSTransition } from "react-transition-group";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}
interface ItemProps {
    Icon?: IconType;
    title: string;
    onClick?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}

class Menu extends PureComponent<Props, unknown> {
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public static Item = class extends PureComponent<ItemProps, unknown> {
        render(): JSX.Element {
            const { Icon, title, isFirst, isLast, onClick } = this.props;
            return (
                <li
                    onClick={() => (onClick ? onClick() : null)}
                    className={classNames(
                        "hover:bg-blue-400 flex items-center p-2 hover:text-white text-blue-400 cursor-pointer",
                        { "rounded-t-xl": isFirst, "rounded-b-xl": isLast },
                    )}
                >
                    {Icon && <Icon size={25} />}
                    <p className="text-white text-xs pl-2">{title}</p>
                </li>
            );
        }
    };

    public render(): JSX.Element {
        const { children, isOpen, onClose } = this.props;
        return (
            <CSSTransition
                in={isOpen}
                timeout={100}
                classNames="fade"
                unmountOnExit
            >
                <div
                    className="absolute bg-gray-900 z-10 rounded-xl w-40"
                    style={{ right: 10, top: 50 }}
                    onMouseLeave={() => onClose()}
                >
                    {children}
                </div>
            </CSSTransition>
        );
    }
}

export default Menu;
