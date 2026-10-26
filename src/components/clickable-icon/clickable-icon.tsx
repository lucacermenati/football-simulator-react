import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import style from './clickable-icon.module.scss';

export type ClickableIconSize = 'sm' | 'md' | 'lg';
export type ClickableIconVariant = 'ghost' | 'filled';

type ClickableIconProps = Omit<
	ComponentPropsWithoutRef<'button'>,
	'onClick' | 'type' | 'children'
> & {
	icon: LucideIcon;
	label: string;
	onClick: () => void;
	size?: ClickableIconSize;
	variant?: ClickableIconVariant;
	isDestructive?: boolean;
	isPending?: boolean;
	isDisabled?: boolean;
};

export default function ClickableIcon({
	icon: Icon,
	label,
	onClick,
	size = 'md',
	variant = 'ghost',
	isDestructive = false,
	isPending = false,
	isDisabled = false,
	className,
	...props
}: ClickableIconProps) {
	const disabled = isDisabled || isPending;

	return (
		<button
			type='button'
			aria-label={label}
			title={label}
			aria-busy={isPending || undefined}
			disabled={disabled}
			className={clsx(
				style.clickableIcon,
				style[size],
				style[variant],
				isDestructive && style.destructive,
				className,
			)}
			onClick={() => {
				if (!disabled) onClick();
			}}
			{...props}
		>
			<Icon className={style.icon} />
		</button>
	);
}
