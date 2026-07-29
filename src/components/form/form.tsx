import clsx from 'clsx';
import style from './form.module.scss';

const Form = ({
	children,
	className,
	disabled,
	...props
}: React.HTMLAttributes<HTMLFormElement> & { disabled?: boolean }) => {
	return (
		<form className={clsx(style.form, className)} {...props}>
			<fieldset disabled={disabled} className={style.fieldset}>
				{children}
			</fieldset>
		</form>
	);
};

export default Form;
