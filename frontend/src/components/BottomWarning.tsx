import { Link } from "react-router-dom"

interface BottomWarningProps {
    buttonText: string;
    label: string;
    to: string;
}

export const BottomWarning = ({buttonText, label, to}: BottomWarningProps) => {
    return <div>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            {label} <Link to={to} className="font-medium text-primary-600
            hover:underline dark:text-primary-500">{buttonText}</ Link>
        </p>
    </div>
}