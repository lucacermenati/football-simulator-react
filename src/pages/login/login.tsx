import { Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/useAuth';
import type { LoginCredentials } from '../../types/api';
import styles from './login.module.scss';

export default function Login() {
	const { isAuthenticated, handleLogin, isLoginPending, isLoginFailed } =
		useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginCredentials>({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	if (isAuthenticated) {
		return <Navigate to='/profile' replace />;
	}

	return (
		<main className={styles.page}>
			<section className={styles.card}>
				<h1>Login</h1>

				<form className={styles.form} onSubmit={handleSubmit(handleLogin)}>
					<label className={styles.field}>
						Email
						<input
							type='email'
							className={styles.input}
							autoComplete='email'
							{...register('email', {
								required: 'Email is required.',

								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Enter a valid email address.',
								},
							})}
						/>
						{errors.email && (
							<p className={styles.fieldError}>{errors.email.message}</p>
						)}
					</label>

					<label className={styles.field}>
						Password
						<input
							type='password'
							className={styles.input}
							autoComplete='current-password'
							{...register('password', {
								required: 'Password is required.',

								minLength: {
									value: 6,
									message: 'Password must contain at least 6 characters.',
								},
							})}
						/>
						{errors.password && (
							<p className={styles.fieldError}>{errors.password.message}</p>
						)}
					</label>

					{isLoginFailed && (
						<div className={styles.error} role='alert'>
							Invalid email or password.
						</div>
					)}

					<button
						type='submit'
						className={styles.button}
						disabled={isSubmitting || isLoginPending}
					>
						{isLoginPending ? (
							<span className={styles.loader} aria-label='Loading' />
						) : (
							'Login'
						)}
					</button>
				</form>
			</section>
		</main>
	);
}
