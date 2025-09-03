import React, { useState, useRef } from 'react';
import Layout from './Layout';

const AdditionalInformation = ({ activeSection, setActiveSection }) => {
  return (
    <Layout 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      showHeader={true}
      showTopNav={true}
    >
      <div className="contact-page">
        <div className="contact-header">
          <h1>Additional Information</h1>
          <p>More details about my background and interests</p>
        </div>

        <div className="about-content">
          <div className="about-main">
              <h3>Technical Skills</h3>
              <p>
                My technical toolkit spans across multiple domains. In web development, I'm proficient 
                with Laravel, React, JavaScript, PHP, and WordPress. For game development, I work with 
                Unity, Unreal Engine, C#, and C++. I also have experience with Python for AI and data 
                science projects, and I'm comfortable with databases like MySQL and PostgreSQL.
              </p>
              <p>
                In the cybersecurity realm, I've developed skills in penetration testing, vulnerability 
                assessment, and security auditing. I enjoy exploring tools like Metasploit, Nmap, and 
                Burp Suite, and I'm always learning about new attack vectors and defense strategies.
              </p>

              <br></br>

              <h3>Education & Certifications</h3>
              <p>
                Currently pursuing a Master's in Data Science and Artificial Intelligence at the 
                University of Girona, where I'm diving deep into machine learning algorithms, 
                neural networks, and data analysis techniques.
              </p>
              <p>
                I hold a Bachelor's degree in Game Design and Development, which gave me a solid 
                foundation in programming, 3D modeling, animation, and game mechanics. During my 
                studies, I had the opportunity to study abroad in Italy and Ireland, experiences 
                that enriched my cultural perspective and problem-solving approaches.
              </p>

                <br></br>
              <h3>Projects & Experience</h3>
              <p>
                At Global Fun Partners, I've been responsible for developing and maintaining corporate 
                websites, creating internal management systems, and building custom solutions for 
                sports organizations. These projects have taught me the importance of user experience, 
                scalability, and maintainable code.
              </p>
              <p>
                My personal projects range from indie games to web applications and cybersecurity 
                tools. Each project is an opportunity to experiment with new technologies and push 
                my creative and technical boundaries.
              </p>
                <br></br>
              <h3>Certifications & Achievements</h3>
              <p>
                I'm actively engaged in cybersecurity learning and practice through various platforms. 
              </p>
              
                <br></br>
          </div>
        </div>
        </div>
    </Layout>
  );
};

export default AdditionalInformation;