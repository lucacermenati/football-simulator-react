import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import style from './card.module.scss';

export default function Card({
	className,
	children,
	...props
}: ComponentPropsWithoutRef<'div'>) {
	return (
		<div className={clsx(style.card, className)} {...props}>
			{children}
		</div>
	);
}
