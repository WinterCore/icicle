import * as React from "react";

const Input: React.FunctionComponent<InputProps> = ({
    placeholder,
    value,
    onChange,
    type,
    disabled,
    onEnter,
    icon
}: InputProps) => {
    const onSubmit = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
        if (key === "Enter" && onEnter) onEnter();
    };

    return (
        <div className="input-outer">
            <input
                type={ type }
                value={ value }
                onKeyDown={ onSubmit }
                onChange={ onChange }
                disabled={ disabled }
                placeholder={ placeholder }
            />
            { icon ? icon : null }
        </div>
    );
};

interface InputProps {
    onChange     : React.ChangeEventHandler;
    onEnter?     : Function;
    value        : string;
    type?        : string;
    placeholder? : string;
    disabled?    : boolean;
    icon?        : React.ReactNode;
}

Input.defaultProps = {
    type        : "text",
    placeholder : "",
    disabled    : false,
};

export default Input;