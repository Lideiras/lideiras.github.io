import React, { useState, useRef } from 'react';
import Layout from './Layout';

const About = ({ activeSection, setActiveSection }) => {
  return (
    <Layout 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      showHeader={true}
      showTopNav={true}
    >
      <div className="contact-page">
        <div className="contact-header">
          <h1>About me</h1>
          <p>Some information about myself</p>
        </div>

        <div className="about-content">
          <div className="about-main">
              <h3>Who I Am</h3>
              <p>
                Hey! I'm Daniel, a curious mind who loves turning ideas into interactive experiences. 
                I'm a full-stack developer and game developer, currently diving deep into AI and 
                Data Science to make my projects smarter and more exciting.
              </p>
              <p>
                I'm pursuing a Master's in Data Science and Artificial Intelligence at Girona University 
                and have a degree in Game Design and Development, with study abroad experiences in Italy 
                and Ireland that broadened my perspective on creativity and technology.
              </p>

              <br></br>

              <h3>What I Do</h3>
              <p>
                I build web apps and custom platforms using Laravel and React. At Global Fun Partners, 
                I've developed and maintained corporate websites with WordPress, created a private company 
                portal to streamline internal operations, and designed tailored solutions for the private 
                area of CBU Bàsquet Lloret, improving team management and communication workflows.
              </p>
              <p>
                But where I really light up is when I'm working on games—designing mechanics, crafting 
                worlds in Unity or Unreal, and bringing stories to life with 3D art and animations. 
                I've also worked on several projects, both personal and during my university studies, 
                which you can explore in the Works section of this site.
              </p>
                <br></br>
              <h3>My Passions</h3>
              <p>
                Cybersecurity is a personal passion of mine, with a focus on pentesting, which I find 
                especially exciting. I'm self-taught in this area and constantly exploring ways to test, 
                secure, and harden systems. For me, programming is as much about creativity as it is 
                about challenging myself to find vulnerabilities and make software more resilient.
              </p>
                <br></br>
              <h3>Beyond Code</h3>
              <p>
                Outside of coding, you'll probably find me on a basketball court, experimenting with 
                new game concepts, or geeking out about the latest trends in AI, ethical hacking, and 
                tech in general. I love blending technical skills with creativity, and I'm always 
                looking for ways to learn, grow, and build projects that are both fun and meaningful.
              </p>
          </div>
        </div>
        </div>
    </Layout>
  );
};

export default About;