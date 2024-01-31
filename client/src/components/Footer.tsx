import GithubIcon from '../assets/github.svg';
import GmailIcon from '../assets/gmail.svg';
import LinkedInIcon from '../assets/linkedin.svg';

const Footer = () => {
  const gmailLink = 'mailto:mdmahfuzurrahmanarif@gmail.com';
  const githubLink = 'https://github.com/mahfuzurrahman98';
  const linkedinLink =
    'https://www.linkedin.com/in/md-mahfuzur-rahman-arif-5643b6146';

  return (
    <div className="flex flex-col justify-center mt-auto">
      <div className="border-t-2 mb-2 border-gray-200 py-3 mt-12">
        <p className="text-center">
          <a
            href="https://mahfuzurrahman98.github.io"
            target="blank"
            className="text-blue-600 font-semibold"
          >
            Mahfuzur Rahman Arif
          </a>
          <span className="ml-2">
            | All rights reserved, {new Date().getFullYear()}
          </span>
        </p>
        <div className="flex gap-x-5 justify-center mt-2">
          <a href={gmailLink} target="blank">
            <img src={GmailIcon} alt="" className="w-5 md:w-6" />
          </a>
          |
          <a href={githubLink} target="blank">
            <img src={GithubIcon} alt="" className="w-5 md:w-6" />
          </a>
          |
          <a href={linkedinLink} target="blank">
            <img src={LinkedInIcon} alt="" className="w-5 md:w-6" />
          </a>
        </div>
      </div>
    </div>
  );
};
export default Footer;
