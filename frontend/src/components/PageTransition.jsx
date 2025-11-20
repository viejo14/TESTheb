import { Children } from 'react'
import { motion as Motion } from 'framer-motion'

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.12
    }
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const PageTransition = ({ children, className = '' }) => {
  const items = Children.toArray(children)

  const containerStyle = className ? undefined : { display: 'contents' }

  return (
    <Motion.div
      className={className || undefined}
      style={containerStyle}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {items.map((child, index) => (
        <Motion.div
          key={child.key ?? index}
          variants={itemVariants}
          style={{
            display: className ? undefined : 'contents',
            willChange: 'transform, opacity'
          }}
        >
          {child}
        </Motion.div>
      ))}
    </Motion.div>
  )
}

export default PageTransition
