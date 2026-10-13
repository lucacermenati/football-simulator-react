import clsx from 'clsx';
import { Trophy } from 'lucide-react';
import type { Competition } from '../../types/api';
import ImageBox from '../image-box/image-box';
import style from './competition-logo.module.scss';

export type CompetitionLogoSize = 'sm' | 'md' | 'lg' | 'xl' | 'fill';

export default function CompetitionLogo({
	competition,
	size = 'md',
	className,
}: {
	competition: Pick<Competition, 'name'> & { logo?: string | null };
	size?: CompetitionLogoSize;
	className?: string;
}) {
	// Any falsy or blank logo (null, undefined, '', whitespace) renders the icon.
	const logo = competition.logo?.trim() || null;

	return (
		<div className={clsx(style.competitionLogo, style[size], className)}>
			{logo ? (
				<ImageBox src={logo} alt={competition.name} className={style.image} />
			) : (
				<Trophy className={style.icon} aria-label={competition.name} />
			)}
		</div>
	);
}
