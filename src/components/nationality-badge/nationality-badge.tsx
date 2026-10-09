import clsx from 'clsx';
import style from './nationality-badge.module.scss';
import * as Flags from 'country-flag-icons/string/3x2';

export default function NationalityBadge({
	nationality,
	className,
}: {
	nationality: string;
	className?: string;
}) {
	// The API uses underscores for sub-national codes (GB_ENG); the library's
	// string exports use underscores too, but hasFlag() expects hyphens, so we
	// resolve the SVG directly and normalise any hyphens to underscores.
	const flagKey = nationality.replace(/-/g, '_') as keyof typeof Flags;
	const svg = Flags[flagKey];

	return (
		<div className={clsx(style.nationalityBadge, className)}>
			{svg ? (
				<span
					className={style.flag}
					dangerouslySetInnerHTML={{ __html: svg }}
				/>
			) : (
				<span>{nationality}</span>
			)}
		</div>
	);
}
