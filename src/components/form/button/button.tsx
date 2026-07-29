import clsx from 'clsx';
import style from './button.module.scss';

export default function Button({
	type = 'button',
	variant = 'primary',
	isDisabled,
	className,
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	type?: 'button' | 'submit' | 'reset';
	variant?: 'primary' | 'secondary';
	isDisabled: boolean;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type={type}
			disabled={isDisabled}
			className={clsx(style.button, style[variant], className)}
			{...props}
		>
			{children}
		</button>
	);
}
