import styles from './loader.module.scss';
export default function Loader() {
	return <span className={styles.loader} aria-label='Loading' />;
}
