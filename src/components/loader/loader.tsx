import clsx from 'clsx';
import styles from './loader.module.scss';

export type LoaderSize = 'sm' | 'md';

export default function Loader({
	size = 'md',
	className,
}: {
	size?: LoaderSize;
	className?: string;
}) {
	return (
		<span
			className={clsx(styles.loader, styles[size], className)}
			aria-label='Loading'
		/>
	);
}
