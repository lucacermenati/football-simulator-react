import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type { Team } from '../../types/api';
import ImageBox from '../image-box/image-box';
import style from './team-logo.module.scss';

export type TeamLogoSize = 'sm' | 'md' | 'lg' | 'xl';

export default function TeamLogo({
	team,
	size = 'md',
	className,
}: {
	team: Pick<Team, 'name' | 'first_color' | 'second_color'> & { logo?: string | null };
	size?: TeamLogoSize;
	className?: string;
}) {
	// Any falsy or blank logo (null, undefined, '', whitespace) renders the colors.
	const logo = team.logo?.trim() || null;

	return (
		<div className={clsx(style.teamLogo, style[size], className)}>
			{logo ? (
				<ImageBox src={logo} alt={team.name} className={style.image} />
			) : (
				<div
					className={style.colors}
					style={
						{
							'--first-color': team.first_color,
							'--second-color': team.second_color,
						} as CSSProperties
					}
				/>
			)}
		</div>
	);
}
