'use client'

import { Button, Input, Tooltip } from "@heroui/react";

interface ActionQuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
}

export function ActionQuantitySelector({ value, onChange }: ActionQuantitySelectorProps) {
    const handleIncrement = () => {
        onChange(Math.min(value + 1, 100));
    };

    const handleDecrement = () => {
        onChange(Math.max(value - 1, 1));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);
        if (!isNaN(newValue)) {
            onChange(Math.min(Math.max(newValue, 1), 100));
        }
    };

    return (
        <Tooltip 
            content="Quantidade de vezes que a ação será executada."
            placement="left"
            closeDelay={0}
        >
            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="flex items-center">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={handleDecrement}
                        className="min-w-8 w-8 h-8 rounded-r-none border-r border-white/10"
                    >
                        -
                    </Button>
                    <Input
                        type="number"
                        value={value.toString()}
                        onChange={handleChange}
                        className="w-12 text-center"
                        variant="flat"
                        size="sm"
                        classNames={{
                            input: "text-center font-mono font-bold p-0",
                            inputWrapper: "h-8 min-h-8 rounded-none bg-transparent shadow-none"
                        }}
                    />
                    <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={handleIncrement}
                        className="min-w-8 w-8 h-8 rounded-l-none border-l border-white/10"
                    >
                        +
                    </Button>
                </div>
            </div>
        </Tooltip>
    );
}
