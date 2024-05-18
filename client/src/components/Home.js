import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Hero, Use1, Use2 } from "../utils/ImageUtils";

const Home = () => {
    // State for the features of Assessify
    const [features] = useState([
        {
            icon: `${Use1}`,
            title: "Everything you need",
            description: "Create comprehensive exams with powerful tools that are easy to use and quick to apply."
        },
        {
            icon: `${Use2}`,
            title: "Empower every student",
            description: "Customize exams to empower each student’s individual needs and let their knowledge shine.​"
        },
    ]);

    return (
        <div className='home-container'>
            <div className='home-hero-sec'>
                <div className='hero-left'>
                    <div className='heading'>
                        <h2>Online Examination Platform</h2>
                    </div>
                    <div className='sub-heading'>
                        <p>Provides a virtual environment for conducting exams. Offers various types of assessments such as MCQ, Fill Up, Assignment Type etc., catering to different learning styles and subjects.</p>
                    </div>
                    <Link to="/register">
                        <Button color='primary'>
                            REGISTER NOW
                        </Button>
                    </Link>
                </div>
                <div className='hero-img'>
                    <img src={Hero} alt="hero" />
                </div>
            </div>

            <div className='home-feature-container'>
                <h3>Why Choose Assessify?</h3>
                <div className='home-feature'>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className='home-feature-card'
                        >
                            <img src={feature.icon} alt={feature.icon} />
                            <p className='title'>{feature.title}</p>
                            <p className='desc'>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
