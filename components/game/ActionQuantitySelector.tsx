'use client'

import { useGame } from "@/context/GameContext";
import { Button, Input, Tooltip } from "@heroui/react";

export function ActionQuantitySelector() {
    const { actionCount, setActionCount } = useGame();

    const handleIncrement = () => {
        setActionCount(Math.min(actionCount + 1, 100));
    };

    const handleDecrement = () => {
        setActionCount(Math.max(actionCount - 1, 1));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setActionCount(Math.min(Math.max(value, 1), 100));
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
                        value={actionCount.toString()}
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
