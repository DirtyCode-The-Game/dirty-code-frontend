
export async function getNoMoneyMessage(): Promise<string> {
    try {
        const response = await fetch('/actions/descriptions/no_money.json');
        if (response.ok) {
            const data = await response.json();
            const pool = data.messages;
            if (pool && pool.length > 0) {
                return pool[Math.floor(Math.random() * pool.length)];
            }
        }
    } catch (error) {
        console.error("Failed to load no money message", error);
    }
    return "Você não tem dinheiro suficiente para isso.";
}

export function isNoMoneyError(message: string): boolean {
    return message.toLowerCase().includes("not enough money");
}

export async function getNoEnergyMessage(): Promise<string> {
    try {
        const response = await fetch('/actions/descriptions/no_energy.json');
        if (response.ok) {
            const data = await response.json();
            const pool = data.stamina;
            if (pool && pool.length > 0) {
                return pool[Math.floor(Math.random() * pool.length)];
            }
        }
    } catch (error) {
        console.error("Failed to load no energy message", error);
    }
    return "Você está sem energia para trabalhar, vá jogar um lolzinho ou tomar um café para desbaratinar...";
}
