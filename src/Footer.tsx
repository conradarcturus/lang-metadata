import React from 'react';

import { getNewURL } from './controls/PageParamsContext';
import CreativeCommonsLicense from './CreativeCommonsLicense';
import { View } from './types/PageParamTypes';

const Footer: React.FC = () => (
  <footer>
    <div>{/* Empty right side for alignment */}</div>
    <p>
      © {new Date().getFullYear()} <a href="https://translationcommons.org">Translation Commons</a>
      . See license, contact info in the <a href={getNewURL({ view: View.About })}>about page</a>.
    </p>
    <CreativeCommonsLicense />
  </footer>
);

export default Footer;
