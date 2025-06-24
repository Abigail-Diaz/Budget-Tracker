import styles from './Error.module.css';

function Error({ message }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.iconArea}>
        <span role="img" aria-label="error" className={styles.emoji}>⚠️</span>
      </div>
      <div className={styles.textArea}>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}

export default Error;
