import clsx from "clsx"
import style from "./free-agent-switch.module.scss"
import { Shield } from "lucide-react"

export default function FreeAgentSwitch({
    value = false,
    onToggle
} : {
    value : boolean
    onToggle: () => void
}) {
    return <div onClick={() => onToggle()} className={clsx(
            style.switch,
            value ? style.switchOn : style.switchOff
        )}>
            <Shield />
    </div>
}