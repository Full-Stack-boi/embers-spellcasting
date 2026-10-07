interface CombatAction {
    name: string;
    description: string;
}

interface CombatActionChipsProps {
    actions: CombatAction[];
    onSelect: (action: CombatAction) => void;
}

export function CombatActionChips({ actions, onSelect }: CombatActionChipsProps) {
    return (
        <div className="ddb-combat-action-chips">
            {actions.map(action => (
                <button
                    key={action.name}
                    type="button"
                    className="ddb-combat-action-chip"
                    onClick={() => onSelect(action)}
                    title={`${action.name}: ${action.description} (Click for details)`}
                >
                    {action.name}
                </button>
            ))}
        </div>
    );
}
