import { useNavigate } from 'react-router-dom'
import { ModusWcButton } from '@trimble-oss/moduswebcomponents-react'

interface Props {
  addLabel: string
}

export function HubPageFooter({ addLabel }: Props) {
  const navigate = useNavigate()

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderTop: '1px solid var(--modus-wc-color-base-200)',
        background: 'var(--modus-wc-color-base-page)',
        marginTop: 'auto',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--modus-wc-color-primary)',
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '0.875rem',
          padding: 0,
        }}
      >
        Back to Dashboard
      </button>
      <ModusWcButton
        variant="filled"
        color="primary"
        size="sm"
        shape="ellipse"
        onButtonClick={() => {}}
      >
        {addLabel}
      </ModusWcButton>
    </div>
  )
}
