import clsx from "clsx"
import style from "./position-badge.module.scss"
export default function PositionBadge({ position, className }: { position: string, className?: string }) {
    const initials = (position: string) => { 
        if (position === "Goalkeeper") {
            return "GK"
        } else if (position === "Defender") {
            return "DF"
        } else if (position === "Midfielder") {
            return "MF"
        } else if (position === "Forward") {
            return "FW"
        }

        return ""
    }
    const shortName = initials(position)

    return (
        <div className={clsx(
            style.positionBadge, 
            shortName === "GK" && style.goalKeeper,
            shortName === "DF" && style.defender,
            shortName === "MF" && style.midfielder,
            shortName === "FW" && style.forward,
            className
        )}>
            {shortName}
        </div>
    )
}