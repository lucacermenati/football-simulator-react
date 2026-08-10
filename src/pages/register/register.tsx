import { Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/useAuth';
import type { RegistrationRequest } from '../../types/api';
import styles from './register.module.scss';
import { Button, Form, TextInput } from '../../components/form';
import ErrorText from '../../components/form/error-text/error-text';
import Loader from '../../components/loader/loader';
import { Volleyball } from 'lucide-react';

export default function Register() {
	const {
		isAuthenticated,
		handleRegistration,
		isRegistrationPending,
		isRegistrationFailed,
	} = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegistrationRequest>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			password_confirmation: '',
		},
	});

	if (isAuthenticated) {
		return <Navigate to='/profile' replace />;
	}

	return (
		<main className={styles.page}>
			<Volleyball className={styles.ballIcon} />
			<section className={styles.card}>
				<div className={styles.header}>Register</div>
				<Form
					onSubmit={handleSubmit(handleRegistration)}
					className={styles.form}
				>
					<TextInput
						id={'name'}
						label='Name'
						type='text'
						error={errors.name?.message}
						autoComplete='name'
						{...register('name', {
							required: 'Name is required.',
						})}
					/>
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

					<TextInput
						id={'password_confirm'}
						label='Confirm Password'
						type='password'
						error={errors.password_confirmation?.message}
						autoComplete='current-password'
						{...register('password_confirmation', {
							required: 'Password confirmation is required.',
						})}
					/>

					{isRegistrationFailed && (
						<ErrorText>
							Something went wrong during registration. Please try again.
						</ErrorText>
					)}

					<Button
						type='submit'
						variant='primary'
						isDisabled={isSubmitting || isRegistrationPending}
						isPending={isRegistrationPending}
					>
						Register
					</Button>
				</Form>
			</section>
			<div className={styles.registerLink}>
				<a href='/login'>I already have an account.</a>
			</div>
		</main>
	);
}
