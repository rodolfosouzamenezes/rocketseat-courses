import { PencilLine } from 'phosphor-react'
import { Avatar } from './Avatar';

import styles from './Sidebar.module.css';

export function Sidebar() {
  const imageBackground = "https://images.unsplash.com/photo-1503903587778-5124b6d043b8?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  return (
    <aside className={styles.sidebar}>
      <img
        className={styles.cover}
        src={imageBackground}
      />

      <div className={styles.profile}>
        <Avatar src="https://github.com/rodolfosouzamenezes.png" />

        <strong>Rodolfo Souza Menezes</strong>
        <span>Desenvolvedor</span>
      </div>

      <footer>
        <a href="#">
          <PencilLine size={20} />
          Editar seu perfil
        </a>
      </footer>
    </aside>
  );
}
