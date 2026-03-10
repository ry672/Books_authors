interface ButtonProps {
    buttonType: "submit"| "button"|"reset";
    buttonText: string;
    className: string
}
export const ButtonApp = ({buttonText, buttonType, className}: ButtonProps) => {
    return (
        <button type={buttonType} className={className}>{buttonText}</button>
    )

}