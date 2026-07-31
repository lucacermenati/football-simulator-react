import { Upload } from 'lucide-react';
import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type InputHTMLAttributes,
} from 'react';
import clsx from 'clsx';
import Field from '../field/field';
import style from './file-upload.module.scss';

type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	id: string;
	label?: string;
	error?: string[] | string;
	className?: string;
	existingUrl?: string | null;
};

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
	(
		{
			id,
			label,
			error,
			className,
			disabled = false,
			existingUrl = null,
			onChange,
			...props
		},
		forwardedRef,
	) => {
		const inputRef = useRef<HTMLInputElement | null>(null);

		const [file, setFile] = useState<File | null>(null);
		const [objectUrl, setObjectUrl] = useState<string | null>(null);

		const previewUrl = objectUrl ?? existingUrl;

		const setInputRef = (element: HTMLInputElement | null) => {
			inputRef.current = element;

			if (typeof forwardedRef === 'function') {
				forwardedRef(element);
			} else if (forwardedRef) {
				forwardedRef.current = element;
			}
		};

		const handleUploadClick = () => {
			if (disabled) return;

			inputRef.current?.click();
		};

		const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
			const nextFile = event.target.files?.[0] ?? null;

			setFile(nextFile);

			onChange?.(event);
		};

		const handleRemove = () => {
			if (disabled || !inputRef.current) return;

			inputRef.current.value = '';
			setFile(null);

			const event = {
				target: inputRef.current,
				currentTarget: inputRef.current,
			} as ChangeEvent<HTMLInputElement>;

			onChange?.(event);
		};

		useEffect(() => {
			if (!file) {
				setObjectUrl(null);
				return;
			}

			const url = URL.createObjectURL(file);

			setObjectUrl(url);

			return () => {
				URL.revokeObjectURL(url);
			};
		}, [file]);

		return (
			<Field
				id={id}
				label={label}
				error={error}
				className={clsx(className, style.border)}
			>
				<input
					{...props}
					ref={setInputRef}
					id={id}
					type='file'
					className={style.file}
					disabled={disabled}
					onChange={handleFileChange}
				/>

				{previewUrl ? (
					<div className={style.previewContainer}>
						<img
							src={previewUrl}
							alt='Selected file preview'
							className={style.preview}
						/>

						<div className={style.actions}>
							<div onClick={handleUploadClick} className={style.actionButton}>
								Replace
							</div>

							<div onClick={handleRemove} className={style.actionButton}>
								Remove
							</div>
						</div>
					</div>
				) : (
					<button
						type='button'
						className={style.emptyFile}
						onClick={handleUploadClick}
						disabled={disabled}
						aria-label='Upload file'
					>
						<Upload />
					</button>
				)}
			</Field>
		);
	},
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
