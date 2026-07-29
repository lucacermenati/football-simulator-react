import Field from '../field/field';
import style from './text-area.module.scss';

export default function TextArea({
	id,
	label,
	placeholder = '',
	error,
	className,
	...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	id: string;
	label?: string;
	placeholder?: string;
	error?: Array<string> | string;
	className?: string;
}) {
	return (
		<Field id={id} label={label} error={error} className={className}>
			<textarea
				className={style.textarea}
				placeholder={placeholder}
				{...props}
			/>
		</Field>
	);
}
