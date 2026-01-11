# Proposta de Tarefa: Execução Parcial de Ações em Batch por Stamina Insuficiente

## 📝 Título
**[FRONTEND] Otimização de Execução em Batch com Stamina Reduzida**

## 📄 Descrição
Atualmente, ao tentar executar uma ação em lote (batch), o sistema bloqueia totalmente a execução se o custo total de stamina (custo unitário × quantidade selecionada) for superior à stamina atual do avatar. 

O objetivo desta tarefa é melhorar a experiência do usuário permitindo que, se ele tiver stamina para realizar pelo menos uma execução, o sistema realize automaticamente o número máximo de execuções possíveis com a stamina disponível no momento, em vez de simplesmente bloquear a ação.

### Critérios de Aceite
1. O botão de ação não deve ficar desabilitado se o avatar tiver stamina suficiente para pelo menos 1 execução.
2. Ao clicar para executar, se a stamina atual for menor que o custo total do batch, o sistema deve calcular o `novoCount = floor(staminaAtual / custoUnitario)`.
3. A chamada para a API deve ser feita com esse `novoCount`.
4. O feedback visual para o usuário deve indicar que a ação foi executada parcialmente devido à stamina limitada.

---

## 💡 Sugestão de Solução

A alteração deve ser focada principalmente no componente `ActionCard.tsx`.

### 1. Atualizar a lógica de verificação de stamina em `components/game/ActionCard.tsx`
Em vez de verificar se a stamina total cabe, verifique se pelo menos uma execução é possível para habilitar o botão.

```typescript
// Lógica sugerida para isStaminaInsufficient
const staminaPerUnit = Math.abs(action.stamina);
const currentStamina = user?.activeAvatar?.stamina ?? 0;
const isStaminaInsufficient = action.stamina < 0 ? currentStamina < staminaPerUnit : false;
```

### 2. Ajustar a quantidade no `handleAction`
No método `handleAction`, antes de chamar `performAction`, recalcular a quantidade baseada na stamina atual se necessário.

```typescript
const handleAction = async () => {
    if (isStaminaInsufficient) {
        // ... (mantém lógica de mensagem de sem energia)
        return;
    }

    let finalCount = actionCount;
    const currentStamina = user?.activeAvatar?.stamina ?? 0;
    const staminaPerUnit = Math.abs(action.stamina);

    // Se for uma ação que consome stamina e o total selecionado excede o disponível
    if (action.stamina < 0 && (staminaPerUnit * actionCount) > currentStamina) {
        finalCount = Math.floor(currentStamina / staminaPerUnit);
    }

    if (finalCount <= 0) return;

    setIsLoading(true);
    try {
        const result = await performAction(action, finalCount);
        // ...
    } catch (error) {
        // ...
    } finally {
        setIsLoading(false);
    }
}
```

### 3. Feedback ao Usuário
Utilizar o retorno da API (`timesExecuted`) para informar quantas vezes a ação foi realmente realizada.
