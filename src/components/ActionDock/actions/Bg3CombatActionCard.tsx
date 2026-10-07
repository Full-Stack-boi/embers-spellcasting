import { IconDashMovement } from "../shared/Bg3Icons";
import { ActionGridTile } from "./ActionGridTile";

interface CombatAction {
    name: string;
    description: string;
}

interface Bg3CombatActionCardProps {
    action: CombatAction;
    index: number;
    onActivate: (action: CombatAction) => void;
}

export function Bg3CombatActionCard({ action, index, onActivate }: Bg3CombatActionCardProps) {
    return (
        <ActionGridTile
            key={action.name}
            name={action.name}
            category="Combat Action"
            subtitle="Action"
            description={action.description}
            icon={<IconDashMovement size={24} />}
            accent="#62c982"
            shortcut={index + 1}
            onActivate={() => onActivate(action)}
        />
    );
}
