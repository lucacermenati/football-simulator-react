import clsx from 'clsx';
import style from './button.module.scss';
import Loader from '../../loader/loader';

export default function Button({
	type = 'button',
	variant = 'primary',
	isDisabled,
	isPending,
	className,
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	type?: 'button' | 'submit' | 'reset';
	variant?: 'primary' | 'secondary';
	isDisabled: boolean;
	isPending: boolean;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type={type}
			disabled={isDisabled || isPending}
			className={clsx(style.button, style[variant], className)}
			{...props}
		>
			{children}
		</button>
	);
}
