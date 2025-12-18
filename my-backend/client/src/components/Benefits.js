import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import flexImg from './../assets/Planning.png';
import affImg from './../assets/Sitting.png';
import connImg from './../assets/Browsing.png';

const cardVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.3,
            duration: 0.6,
            type: 'spring',
        },
    }),
};

const Benefits = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    const benefits = [
        {
            title: "Personalized learning",
            text: "Students choose the subjects they want to focus on — tailored to their own pace and schedule.",
            img: flexImg,
            alt: "flexibility",
        },
        {
            title: "Affordability",
            text: "Affordable mentorship made possible because our mentors are university students too — passionate, knowledgeable, and offering guidance at prices that won’t break your budget.",
            img: affImg,
            alt: "affordability",
        },
        {
            title: "Community & Support",
            text: "Join a supportive community of learners and mentors who grow together.",
            img: connImg,
            alt: "connect",
        },
    ];

    return (
        <>
            <h2 className="text-center mb-4">What makes our app your right choice?</h2>
            <div className="container" ref={ref}>
                <div className="card-group d-flex justify-content-center flex-wrap gap-4">
                    {benefits.map((item, i) => (
                        <motion.div
                            className="card"
                            key={i}
                            custom={i}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={cardVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                maxWidth: '300px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                borderRadius: '1rem',
                            }}
                        >
                            <img
                                src={item.img}
                                alt={item.alt}
                                style={{ width: '100%', height: 'auto', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">{item.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Benefits;
