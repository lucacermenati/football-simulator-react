import clsx from 'clsx';
import Field from '../field/field';
import style from './text-input.module.scss';

export default function TextInput({
	id,
	label,
	placeholder = '',
	error,
	className,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	id: string;
	label?: string;
	placeholder?: string;
	error?: Array<string> | string;
	className?: string;
}) {
	return (
		<Field id={id} label={label} error={error} className={className}>
			<input
				type='text'
				className={clsx(style.input, error && style.error)}
				placeholder={placeholder}
				{...props}
			/>
		</Field>
	);
}
