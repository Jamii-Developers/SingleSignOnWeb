import React from 'react';
import { Alert } from '@mui/material'; // Import Alert component from MUI
import './sass/aboutus.sass'

const Aboutus = () => {
    const services = [
        "Filing Cabinet - currently in development, designed to streamline document storage and management.",
        "Social - currently in the process of gathering requirements for an intuitive social networking platform tailored for professionals.",
        "Organizer - a productivity tool that’s under development, aiming to help users manage tasks and collaborate efficiently.",
        "Document Creation - in progress, offering users the ability to create, edit, and manage documents directly within the platform.",
    ];

    function ListOfServices(props) {
        return <li>{props.service}</li>;
    }

    function PageUnderDevelopmentNotice() {
        return (
            <Alert variant="filled" severity="info" className="alert-info">
                This page is currently under development. Please check back later for updates and new features.
            </Alert>
        );
    }

    return (
        <div id="AboutUsPage">
            <PageUnderDevelopmentNotice />
            <h1>About Us</h1>
            <br />
            <h3>1. Who We Are</h3>
            <p>
                Jamii Developers is a forward-thinking technology company dedicated to developing innovative digital solutions aimed at solving pressing challenges in Kenya and beyond. Founded by Michael Nyakonu, Jamii Developers strives to bridge the technological gap in emerging markets by providing efficient, user-centric software solutions that address real-world problems.
            </p>
            <p>
                Our mission is to empower individuals, businesses, and organizations by creating software that simplifies their daily tasks, enhances productivity, and provides better access to information and services. Through our core values of innovation, integrity, and impact, we aim to drive lasting change and contribute to the digital transformation of industries.
            </p>
            <br />
            <h3>2. What is "JamiiX"?</h3>
            <p>
                "JamiiX" is an integrated digital platform designed to simplify access to multiple services through a single, secure login. Initially conceptualized to provide seamless authentication for a variety of applications, JamiiX has evolved into a multi-functional ecosystem that connects various tools and services under one unified platform. This not only eliminates the need for multiple logins but also enhances the user experience by allowing smooth transitions between different applications.
            </p>
            <p>
                In addition to streamlining user access, JamiiX is built with scalability and security in mind. Our long-term vision includes incorporating advanced security features, such as Multi-Factor Authentication (MFA) and biometric login, ensuring that our users have the most secure, hassle-free experience possible.
            </p>
            <p>
                In essence, JamiiX functions similarly to Google’s Single Sign-On (SSO) but is specifically tailored to address the unique needs and challenges of the Kenyan and African markets. Our goal is to provide a reliable, safe, and user-friendly platform that users can trust for all their digital needs.
            </p>
            <br />
            <h3>3. Our Vision</h3>
            <p>
                At Jamii Developers, our vision is to lead the way in technological innovation by delivering cutting-edge solutions that improve the quality of life for people across Kenya and Africa. We aim to become a key player in the global technology ecosystem by building products that meet the needs of both local and international markets.
            </p>
            <p>
                We are committed to fostering a culture of continuous improvement and embracing emerging technologies, ensuring that we remain at the forefront of the ever-evolving digital landscape.
            </p>
            <br />
            <h3>4. Our Architecture</h3>
            <p>
                The architecture behind JamiiX is designed to be modular, flexible, and scalable. Our platform allows for the seamless integration of various services, all while maintaining high levels of security, reliability, and user-friendliness. Each service within the JamiiX ecosystem operates independently but is tightly interconnected with other services, providing users with a cohesive, efficient experience.
            </p>
            <p>
                As we continue to expand our platform, we remain focused on optimizing user experience and ensuring that all features are easy to use, reliable, and aligned with the latest industry standards.
            </p>
            <br />
            <h3>5. Our Services</h3>
            <p>
                At Jamii Developers, we are committed to providing a range of services designed to meet the diverse needs of our users. From organizational tools to social platforms, our goal is to offer solutions that enhance productivity, simplify tasks, and foster collaboration. Below are the services we are actively developing:
            </p>
            <ul>
                {services.map((service, index) => (
                    <ListOfServices key={index} service={service} />
                ))}
            </ul>

            <br />
            <h3>6. Join Us on Our Journey</h3>
            <p>
                We invite you to join us as we continue to innovate and shape the future of technology. Whether you’re an individual looking for efficient tools or a business seeking digital solutions, Jamii Developers is here to support your journey. Together, we can create a brighter, more connected future.
            </p>
            <p>
                Stay tuned for updates on our services, and don’t hesitate to reach out to us if you have any questions or suggestions. We value the input of our users and are constantly striving to improve our offerings based on your needs.
            </p>
        </div>
    );
};

export default Aboutus;
