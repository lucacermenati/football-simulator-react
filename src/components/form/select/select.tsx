import clsx from 'clsx';
import Field from '../field/field';
import style from './select.module.scss';

export default function Select({
	id,
	label,
	error,
	className,
	children,
	...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
	id: string;
	label?: string;
	error?: Array<string> | string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<Field id={id} label={label} error={error} className={className}>
			<select
				className={clsx(style.select, error && style.error)}
				{...props}
			>
				{children}
			</select>
		</Field>
	);
}
