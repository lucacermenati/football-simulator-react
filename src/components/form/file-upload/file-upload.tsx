import { Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Field from '../field/field';
import style from './file-upload.module.scss';
import clsx from 'clsx';

export type FileUploadValue = {
	file: File | null;
	remove: boolean;
};

type FileUploadProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'type' | 'onChange'
> & {
	id: string;
	label?: string;
	error?: string[] | string;
	className?: string;
	existingUrl?: string | null;
	onChange?: (value: FileUploadValue) => void;
};

export default function FileUpload({
	id,
	label,
	error,
	className,
	disabled = false,
	existingUrl = null,
	onChange,
	...props
}: FileUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const [file, setFile] = useState<File | null>(null);
	const [remove, setRemove] = useState(false);
	const [objectUrl, setObjectUrl] = useState<string | null>(null);

	const shouldShowExisting = Boolean(existingUrl) && !remove;
	const previewUrl = objectUrl ?? (shouldShowExisting ? existingUrl : null);

	const emitChange = (nextFile: File | null, nextRemove: boolean) => {
		onChange?.({
			file: nextFile,
			remove: nextRemove,
		});
	};

	const handleUploadClick = () => {
		if (disabled) return;

		inputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const nextFile = event.target.files?.[0] ?? null;

		setFile(nextFile);
		setRemove(false);

		emitChange(nextFile, false);
	};

	const handleRemove = () => {
		if (disabled) return;

		if (inputRef.current) {
			inputRef.current.value = '';
		}

		setFile(null);
		setRemove(true);

		emitChange(null, true);
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
				ref={inputRef}
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
}
