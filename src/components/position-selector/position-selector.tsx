import clsx from "clsx";
import PositionBadge from "../position-badge/position-badge";
import style from "./position-selector.module.scss";

const positions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward"
];

export default function PositionSelector({
    value,
    onSelect
} : {
    value: string | null
    onSelect: (position: string) => void
}) {
    return <div className={style.selector}>
        {positions.map((position) => 
            <div onClick={() => onSelect(position)}>
                <PositionBadge 
                    position={position} 
                    className={clsx(style.positionBadge, position === value && style.highlightedBadge)}
                />
            </div>
        )}
    </div>
}