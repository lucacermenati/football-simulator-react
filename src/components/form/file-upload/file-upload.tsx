import Field from '../field/field';
import style from './file-upload.module.scss';

export default function FileUpload({
	id,
	label = null,
	error,
	className,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	id: string;
	label?: string;
	placeholder?: string;
	error?: Array<string> | string;
	className?: string;
}) {
	return (
		<Field id={id} label={label} error={error} className={className}>
			<input type='file' className={style.file} {...props} />
		</Field>
	);
}
