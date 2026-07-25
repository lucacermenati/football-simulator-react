import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Link, PaginationMeta } from '../../types/api';
import style from './pagination.module.scss';
import clsx from 'clsx';

export default function Pagination({
	meta,
	onLinkClicked,
	disableChevrons = false,
}: {
	meta: PaginationMeta;
	onLinkClicked: (link: Link) => void;
	disableChevrons?: boolean;
}) {
	const links = [...(meta?.links || [])];
	const chevronLeft = links?.shift();
	const chevronRight = links?.pop();

	console.log({ chevronLeft, links, chevronRight });

	return (
		<div
			className={clsx(style.pagination, disableChevrons && style.noChevrons)}
		>
			{!disableChevrons && (
				<ChevronLeft
					onClick={() => onLinkClicked(chevronLeft)}
					className={clsx(
						style.chevron,
						chevronLeft?.active && style.activeChevron,
						!chevronLeft?.url && style.disabledChevron,
					)}
				/>
			)}
			{links?.map((link) => (
				<span
					onClick={() => onLinkClicked(link)}
					className={clsx(style.page, link.active && style.activePage)}
				>
					{link.label}
				</span>
			))}
			{!disableChevrons && (
				<ChevronRight
					onClick={() => onLinkClicked(chevronRight)}
					className={clsx(
						style.chevron,
						chevronRight?.active && style.activeChevron,
						!chevronRight?.url && style.disabledChevron,
					)}
				/>
			)}
		</div>
	);
}
