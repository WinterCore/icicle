import * as React      from "react";

const Button: React.FunctionComponent<ButtonProps> = (props) => {
    const { children, isLoading, disabled, onClick } = props;
    return (
        <button onClick={ onClick } disabled={ isLoading || disabled }>
            { isLoading ? "Loading..." : children }
        </button>
    );
};

interface ButtonProps {
    children   : React.ReactNode,
    isLoading? : boolean,
    type?      : string,
    onClick?   : React.EventHandler<React.SyntheticEvent>,
    disabled?  : boolean
}

Button.defaultProps = {
    isLoading : false,
    type      : "button",
    disabled  : false,
    onClick   : () => {}
};

export default Button;