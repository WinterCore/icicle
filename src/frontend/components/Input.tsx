import * as React from "react";

const Input: React.FunctionComponent<InputProps> = ({
    placeholder,
    value,
    onChange,
    type,
    onEnter,
    icon
}: InputProps) => {
    const onSubmit = ({ key }) => {
        if (key === "Enter") onEnter();
    };

    return (
        <div className="input-outer">
            <input
                type={ type }
                value={ value }
                onKeyDown={ onSubmit }
                onChange={ onChange }
                placeholder={ placeholder }
            />
            { icon ? icon : null }
        </div>
    );
};

interface InputProps {
    onChange     : React.ChangeEventHandler,
    onEnter?     : Function,
    value        : string,
    type?        : string,
    placeholder? : string,
    icon?        : React.ReactNode
}

Input.defaultProps = {
    type        : "text",
    placeholder : ""
};

export default Input;