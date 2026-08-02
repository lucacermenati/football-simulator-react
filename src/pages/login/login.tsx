import { Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/useAuth';
import type { LoginCredentials } from '../../types/api';
import styles from './login.module.scss';
import { Button, Form, TextInput } from '../../components/form';
import ErrorText from '../../components/form/error-text/error-text';
import Loader from '../../components/loader/loader';
import { Volleyball } from 'lucide-react';

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
			<Volleyball className={styles.ballIcon} />
			<section className={styles.card}>
				<div className={styles.header}>Login</div>
				<Form onSubmit={handleSubmit(handleLogin)} className={styles.form}>
					<TextInput
						id={'email'}
						label='Email'
						type='email'
						error={errors.email?.message}
						autoComplete='email'
						{...register('email', {
							required: 'Email is required.',

							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: 'Enter a valid email address.',
							},
						})}
					/>

					<TextInput
						id={'password'}
						label='Password'
						type='password'
						error={errors.password?.message}
						autoComplete='current-password'
						{...register('password', {
							required: 'Password is required.',
						})}
					/>

					{isLoginFailed && <ErrorText>Invalid email or password.</ErrorText>}

					<Button
						type='submit'
						variant='primary'
						isDisabled={isSubmitting || isLoginPending}
					>
						{isLoginPending ? <Loader /> : 'Login'}
					</Button>
				</Form>
			</section>
			<div className={styles.registerLink}>
				<a href='/register'>Create an account</a>
			</div>
		</main>
	);
}
