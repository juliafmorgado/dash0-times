import { createPortal } from 'react-dom'
import Toast from './Toast'
import styles from './ToastContainer.module.css'

function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null

  return createPortal(
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          title={toast.title}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  )
}

export default ToastContainer