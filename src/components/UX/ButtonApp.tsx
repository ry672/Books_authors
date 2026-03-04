interface ButtonProps {
    buttonType: "submit"| "button"|"reset";
    buttonText: string;
}
export const ButtonApp = ({buttonText, buttonType}: ButtonProps) => {
    return (
        <button type={buttonType} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 my-5 rounded focus:outline-none focus:shadow-outline">{buttonText}</button>
    )

}