import { motion, AnimatePresence } from 'framer-motion'

const LABELS = {
  chair:   'Lounge Chair',
  lamp:    'Floor Lamp',
  shelf:   'Bookshelf',
  table:   'Side Table',
  pendant: 'Pendant Light',
  plant:   'Potted Plant',
}

export default function FurnitureHint({ activeName }) {
  const label = LABELS[activeName] || null

  return (
    <>
      {/* Active furniture label */}
      <AnimatePresence mode="wait">
        {label && (
          <motion.div
            key={activeName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: '7rem',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              textAlign: 'center',
            }}
          >
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '1.3rem',
              color: 'rgba(255,255,255,0.50)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle hint */}
      <AnimatePresence>
        {!activeName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: 'absolute',
              bottom: '7rem',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          >
            <p style={{
              color: 'rgba(255,255,255,0.16)',
              fontSize: '0.68rem',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              fontWeight: 300,
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}>
              watch it take shape
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
