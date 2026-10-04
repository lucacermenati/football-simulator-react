import clsx from 'clsx';
import style from './nationality-badge.module.scss';
import * as Flags from 'country-flag-icons/string/3x2';
import { hasFlag } from 'country-flag-icons';

export default function NationalityBadge({
	nationality,
	className,
}: {
	nationality: string;
	className?: string;
}) {
	return (
		<div className={clsx(style.nationalityBadge, className)}>
			{hasFlag(nationality) ? (
				<span
					className={style.flag}
					dangerouslySetInnerHTML={{
						__html: Flags[nationality as keyof typeof Flags],
					}}
				/>
			) : (
				<span>{nationality}</span>
			)}
		</div>
	);
}