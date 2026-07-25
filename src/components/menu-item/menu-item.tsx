import clsx from 'clsx';
import style from './menu-item.module.scss';

export default function MenuItem({
	children,
	isActive,
	onClick,
}: {
	children: React.ReactNode;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<div
			className={clsx(style.item, isActive && style.activeItem)}
			onClick={() => onClick()}
		>
			{children}
		</div>
	);
}
