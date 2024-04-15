interface LabelProps {
    label: string
}

export const Label = ({ label }: LabelProps) => {
    return <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
    </div>
}