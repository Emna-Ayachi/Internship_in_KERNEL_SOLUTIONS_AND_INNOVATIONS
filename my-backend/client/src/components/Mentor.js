import { motion } from 'framer-motion';
import menImg from './../assets/Design.png';
import Button from './Button.js';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const imageVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const textVariant = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Mentor = () => {
  return (
    <motion.div
      className="container mt-5 py-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="d-flex align-items-center flex-wrap gap-4">
        <motion.div variants={imageVariant}>
          <img
            style={{ width: '300px', height: 'auto', borderRadius: '1rem' }}
            src={menImg}
            alt="mentor"
          />
        </motion.div>

        <motion.div
          className="flex-grow-1"
          variants={textVariant}
          style={{ minWidth: '280px', maxWidth: '600px' }}
        >
          <motion.h2 className="mb-3" variants={textVariant}>
            Empower others. Earn on your schedule. Keep learning too.
          </motion.h2>
          <motion.p className="mb-4" variants={textVariant}>
            Our platform gives you the flexibility to choose when you mentor, while staying 
            connected to your own learning path. It’s a chance to grow, give back, and earn — 
            all on your terms.
          </motion.p>
        <Button label="Mentor" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Mentor;
