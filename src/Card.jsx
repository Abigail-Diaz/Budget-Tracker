// This component renders a card with a title and content.

import styles from "./card.module.css";

function Card({ title, amount }) {
  return (
    <div className={styles.incomeCard}>
      <h3> {title} </h3>
      <p>${amount.toFixed(2)}</p>
    </div>
  );
}

export default Card;
