import styles from './Error.module.css';

function Error({ message, error }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.iconArea}>
        <span role="img" aria-label="error" className={styles.emoji}>⚠️</span>
      </div>
      <div className={styles.textArea}>
        <p className={styles.message}>{message}</p>
        {error && <p className={styles.detail}>{error}</p>}
      </div>
    </div>
  );
}

export default Error;
