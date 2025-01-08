import React from 'react';
import { ReactNode } from "react";


interface AboutSectionProps {
    title: string;
    children: ReactNode;
  }

class AboutSection extends React.Component<AboutSectionProps> {
  render() {
    const { title, children } = this.props;
    return (
      <div>
        <div className="text-start">
          <h2 className="text-2xl md:text-3xl font-bold py-5">{title}</h2>
          {children}
        </div>
      </div>
    );
  }
}

export default AboutSection;