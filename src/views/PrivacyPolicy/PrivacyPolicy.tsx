import React from "react";
import { TextFormatter, SidePaddingWrapper } from "../../components/Containers";
import { Box } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    policy: {
      "& p": {
        maxWidth: "100vw",
      },
    },
  });
});

const PRIVACY_POLICY_CONTENT = [
  {
    type: "h1",
    data: "Privacy Policy",
  },
  {
    type: "paragraph",
    data:
      'Justine Gagnepain ("us", "we", or "our") operates the www.boulette.ca website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.',
  },
  {
    type: "paragraph",
    data:
      "We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.",
  },
  {
    type: "h2",
    data: "Information Collection And Use",
  },
  {
    type: "paragraph",
    data:
      "We collect several different types of information for various purposes to provide and improve our Service to you.",
  },
  {
    type: "h2",
    data: "Types of Data Collected",
  },
  {
    type: "h3",
    data: "Personal Data",
  },
  {
    type: "paragraph",
    data:
      'While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, Cookies and Usage Data.',
  },
  {
    type: "h3",
    data: "Usage Data",
  },
  {
    type: "paragraph",
    data: `We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.`,
  },
  {
    type: "h3",
    data: "Tracking & Cookies Data",
  },
  {
    type: "paragraph",
    data: `We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.`,
  },
  {
    type: "paragraph",
    data: `Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.`,
  },
  {
    type: "paragraph",
    data: `You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.`,
  },
  {
    type: "paragraph",
    data: `Examples of Cookies we use:`,
  },
  {
    type: "list",
    data: [
      "Session Cookies: We use Session Cookies to operate our Service.",
      "Preference Cookies: We use Preference Cookies to remember your preferences and various settings.",
      "Security Cookies: We use Security Cookies for security purposes.",
    ],
  },
  {
    type: "h2",
    data: "Use of Data",
  },
  {
    type: "paragraph",
    data: "KNØX Industries uses the collected data for various purposes:",
  },
  {
    type: "list",
    data: [
      "To provide and maintain the Service",
      "To notify you about changes to our Service",
      "To provide customer care and support",
    ],
  },
];

interface PrivacyPolicyPageProps {}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = () => {
  const classes = useStyles();
  return (
    <Box py={4} className={classes.policy}>
      <SidePaddingWrapper>
        <TextFormatter
          content={PRIVACY_POLICY_CONTENT}
          keyPrefix={"privacy-policy"}
        />
      </SidePaddingWrapper>
    </Box>
  );
};

export default PrivacyPolicyPage;
