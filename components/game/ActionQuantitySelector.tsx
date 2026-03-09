'use client'

import { Button, Input, Tooltip } from "@heroui/react";

interface ActionQuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
}

export function ActionQuantitySelector({ value, onChange }: ActionQuantitySelectorProps) {
    const handleIncrement = () => {
        onChange(Math.min(value + 1, 99));
    };

    const handleDecrement = () => {
        onChange(Math.max(value - 1, 0));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);
        if (!isNaN(newValue)) {
            onChange(Math.min(Math.max(newValue, 0), 99));
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
                        className="min-w-10 w-10 h-10 md:min-w-8 md:w-8 md:h-8 rounded-r-none border-r border-white/10"
                    >
                        -
                    </Button>
                    <Input
                        type="number"
                        min={0}
                        max={99}
                        value={value.toString()}
                        onChange={handleChange}
                        className="w-14 md:w-12 text-center"
                        variant="flat"
                        size="sm"
                        classNames={{
                            input: "text-center font-mono font-bold p-0 focus:outline-none",
                            inputWrapper: "h-10 md:h-8 min-h-10 md:min-h-8 rounded-none bg-transparent shadow-none focus-within:ring-0"
                        }}
                    />
                    <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={handleIncrement}
                        className="min-w-10 w-10 h-10 md:min-w-8 md:w-8 md:h-8 rounded-l-none border-l border-white/10"
                    >
                        +
                    </Button>
                </div>
            </div>
        </Tooltip>
    );
}
