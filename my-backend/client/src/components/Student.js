import { motion } from 'framer-motion';
import stuImg from './../assets/Planning2.png';
import Button from './Button.js';


const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};


const textVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};


const imageVariant = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Student = () => {
  return (
    <motion.div
      className="container mt-5 py-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="d-flex align-items-center flex-wrap gap-4">
        <motion.div
          className="flex-grow-1 me-auto"
          variants={textVariant}
          style={{ minWidth: '280px', maxWidth: '600px' }}
        >
          <motion.h2 className="mb-3" variants={textVariant}>
            Study smarter, not harder — with support that fits your life.
          </motion.h2>
          <motion.p className="mb-4" variants={textVariant}>
            Take control of your learning journey. Whether you're catching up or reaching ahead, 
            our platform lets you choose the subjects, schedule sessions on your time, and grow at 
            your own pace — all with support that understands student life.
          </motion.p>
        <Button label="Student" />
        </motion.div>

        <motion.div variants={imageVariant}>
          <img
            style={{ width: '300px', height: 'auto', borderRadius: '1rem' }}
            src={stuImg}
            alt="student"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Student;
