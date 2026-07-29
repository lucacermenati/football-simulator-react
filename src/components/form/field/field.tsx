import clsx from 'clsx';
import styles from './field.module.scss';
import ErrorText from '../error-text/error-text';

export default function Field({
	id,
	label,
	error,
	children,
	className,
}: {
	id: string;
	label?: string;
	error?: Array<string> | string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={clsx(styles.field, className)}>
			{label && (
				<label htmlFor={id} className={styles.label}>
					{label}
				</label>
			)}
			{children}
			{error && <ErrorText>{error}</ErrorText>}
		</div>
	);
}
