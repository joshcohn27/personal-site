import React, { useState } from 'react';

interface OptionFunctions {
  [key: string]: () => void;
}

interface DropdownProps {
  options: OptionFunctions;
}

const DropDownButton = ({ options }: DropdownProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedKey = event.target.value;
        setSelectedOption(selectedKey);

        const action = options[selectedKey];
        if (action) {
            action();
        }
    }

    const dropDownStyle = {
        backgroundColor: '#E5E5E5',
        padding: ".5em",
        borderRadius: ".5em",
        border: "none",
        fontSize: "24px",
        width: "10em",
        cursor: "pointer",
        fontFamily: 'Instrument Sans, sans-serif',

    }

    return (
        <div>
            <select id="dropdown" value={selectedOption || ''} style={dropDownStyle} onChange={handleChange}>
                <option value="" disabled></option>
                {Object.entries(options).map(([key]) => (
                <option key={key} value={key}>
                    {key}
                </option>
                ))}
            </select>
        </div>
    )
}

export { DropDownButton }