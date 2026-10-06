export default function FreeAgentSwitch({
    value = false,
    onToggle
} : {
    value : boolean
    onToggle: () => void
}) {
    return <div onClick={() => onToggle()}>
        {value ? "ON" : "OFF"}
    </div>
}