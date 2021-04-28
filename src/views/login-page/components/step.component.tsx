import React, { PureComponent } from "react";

interface Props {
    title: string;
    description: string;
    extra?: string;
}

class LoginStep extends PureComponent<Props, unknown> {
    public render(): JSX.Element {
        const { description, title, children, extra } = this.props;
        return (
            <div className="bg-white px-12 py-8 mt-4 md:border rounded-sm border-gray-200 md:px-16 md:py-12">
                <h4 className="text-base font-bold mb-4">{title}</h4>
                <p className="text-sm text-gray-500 mb-6">{description}</p>
                <p className="text-sm text-gray-500 mb-6">{extra}</p>
                {children}
            </div>
        );
    }
}

export default LoginStep;
