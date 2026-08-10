import clsx from 'clsx';
import styles from './loader.module.scss';
export default function Loader({ className }: { className?: string }) {
	return (
		<span className={clsx(styles.loader, className)} aria-label='Loading' />
	);
}
