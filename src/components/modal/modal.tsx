import { createPortal } from 'react-dom';
import styles from './modal.module.scss';
import { useEffect } from 'react';

export default function Modal({
	children,
	title,
	description = null,
	onCancel,
	onSubmit,
	isSubmitting = false,
	cancelText = 'cancel',
	submitText = 'submit',
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
	onCancel: () => void;
	onSubmit: () => void;
	isSubmitting?: boolean;
	cancelText?: string;
	submitText?: string;
}) {
	// Close modal on Escape key press
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onCancel();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [onCancel]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, []);

	return createPortal(
		<div className={styles.overlay} onClick={onCancel}>
			<div
				className={styles.modal}
				onClick={(event) => event.stopPropagation()}
			>
				<header className={styles.header}>
					<div className={styles.title}>{title}</div>
					{description && <p className={styles.description}>{description}</p>}
				</header>

				<div className={styles.content}>{children}</div>

				<footer className={styles.footer}>
					<button
						type='button'
						className={styles.cancelButton}
						onClick={onCancel}
						disabled={isSubmitting}
					>
						{cancelText}
					</button>

					<button
						type='button'
						className={styles.submitButton}
						onClick={onSubmit}
						disabled={isSubmitting}
					>
						{submitText}
					</button>
				</footer>
			</div>
		</div>,
		document.body,
	);
}
