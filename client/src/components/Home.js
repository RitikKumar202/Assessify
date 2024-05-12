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
        <div className='my-5'>
            <div className='flex justify-center gap-4 px-3'>
                <div className='w-[550px] flex flex-col items-center justify-center'>
                    <div>
                        <h2>Online Examination Platform</h2>
                    </div>
                    <div className='text-center'>
                        <p>Provides a virtual environment for conducting exams. Offers various types of assessments such as MCQ, Fill Up, Assignment Type etc., catering to different learning styles and subjects.</p>
                    </div>
                    <Link to="/register">
                        <Button>
                            REGISTER NOW
                        </Button>
                    </Link>
                </div>
                <div className='h-96 md:block hidden'>
                    <img className='h-[100%]' src={Hero} alt="hero" />
                </div>
            </div>

            <div className='mt-8 flex flex-col items-center justify-center'>
                <h3>Why Choose Assessify?</h3>
                <div className='flex justify-center items-center flex-wrap gap-[20px] mt-5'>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className='w-[350px] rounded-md px-3 py-5 flex flex-col items-center justify-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:bg-[#57575b] hover:text-white duration-300'
                        >
                            <img className='w-16' src={feature.icon} alt={feature.icon} />
                            <p className='mt-3 text-2xl text-center font-semibold'>{feature.title}</p>
                            <p className='text-center text-base'>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
