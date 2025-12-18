import { motion } from 'framer-motion';
import introImg from "./../assets/Screen.png";
import Button from './Button.js';


const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const zoomInText = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: "easeOut" } },
};

const Introduction = () => {
  return (
    <motion.div
      className="d-flex align-items-center justify-content-center px-4 flex-wrap"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ minHeight: '100vh' }}
    >
      <motion.div
        variants={fadeUp}
        style={{ flex: '0 0 auto' }}
      >
        <img
          style={{ width: '300px', height: 'auto', borderRadius: '1rem' }}
          src={introImg}
          alt="a bear studying"
        />
      </motion.div>

      <motion.div
        className="ms-3"
        variants={containerVariants}
        style={{ maxWidth: '500px' }}
      >
        <motion.h1
          className="mb-3"
          variants={zoomInText}
          style={{ fontSize: '2.5rem', fontWeight: 'bold' }}
        >
          Your goals, your schedule, your price.
        </motion.h1>

        <motion.p
          className="mb-4"
          variants={fadeUp}
          style={{ fontSize: '1.2rem' }}
        >
          Our mission is to provide affordable mentorship for uni students, in Tunisia.
        </motion.p>

        <motion.div className="d-flex gap-3" variants={fadeUp}>
          <Button label='Student' />
          <Button label='Mentor' />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Introduction;
