import clsx from 'clsx';
import style from './error-text.module.scss';
import { CircleAlert } from 'lucide-react';

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Retry later.';

export default function ErrorText({
	children,
	className,
}: {
	/** One or more messages. Empty or missing falls back to DEFAULT_ERROR_MESSAGE. */
	children?: Array<string | undefined | null> | string | null;
	className?: string;
}) {
	const given = Array.isArray(children) ? children : [children];
	const messages = given.filter(
		(message): message is string => typeof message === 'string' && message.trim() !== '',
	);
	const toRender = messages.length > 0 ? messages : [DEFAULT_ERROR_MESSAGE];

	return (
		<div className={clsx(style.errorField, className)}>
			{toRender.map((error, index) => (
				<div className={style.errorItem} key={index}>
					<CircleAlert className={style.errorIcon} />
					<div className={style.errorText}>{error}</div>
				</div>
			))}
		</div>
	);
}
