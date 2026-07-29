import clsx from 'clsx';
import style from './error-text.module.scss';
import { CircleAlert } from 'lucide-react';

export default function ErrorText({
	children,
	className,
}: {
	children: Array<string> | string;
	className?: string;
}) {
	return (
		<div className={clsx(style.errorField, className)}>
			{Array.of(children).map((error, index) => (
				<div className={style.errorItem} key={index}>
					<CircleAlert className={style.errorText} />
					<div className={style.errorText}>{error}</div>
				</div>
			))}
		</div>
	);
}
