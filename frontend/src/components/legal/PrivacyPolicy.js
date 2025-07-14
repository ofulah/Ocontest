import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Last Updated: June 28, 2025
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Ocontest ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and protect your information when you visit our website (www.ocontest.net) or use our services, including participating in contests. By using our platform, you agree to the terms outlined in this Privacy Policy.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Information We Collect
        </Typography>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <ul>
          <Typography component="li">Name</Typography>
          <Typography component="li">Email address</Typography>
          <Typography component="li">Phone number</Typography>
          <Typography component="li">Social media profiles (e.g., Instagram, TikTok, YouTube)</Typography>
          <Typography component="li">Portfolio and previous works</Typography>
          <Typography component="li">Mailing address (for product shipment)</Typography>
          <Typography component="li">Payment information (for prize distribution)</Typography>
        </ul>

        <Typography variant="h6" gutterBottom>
          Non-Personal Information
        </Typography>
        <ul>
          <Typography component="li">Browser type and version</Typography>
          <Typography component="li">Operating system</Typography>
          <Typography component="li">IP address</Typography>
          <Typography component="li">Device information</Typography>
          <Typography component="li">Usage data (e.g., pages visited, time spent)</Typography>
        </ul>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          How We Use Your Information
        </Typography>
        <Typography variant="body1">
          We use the collected information for the following purposes:
        </Typography>
        <ul>
          <Typography component="li">To manage and administer contests, including verifying participant eligibility, contacting winners, and distributing prizes.</Typography>
          <Typography component="li">To communicate important contest details and updates via email, SMS, or phone calls.</Typography>
          <Typography component="li">To improve and customize user experience on our platform.</Typography>
          <Typography component="li">To analyze usage patterns and enhance platform functionality.</Typography>
          <Typography component="li">To ensure compliance with our contest rules and platform policies.</Typography>
          <Typography component="li">To send promotional communications regarding upcoming contests and opportunities (you may opt-out at any time).</Typography>
        </ul>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Information Sharing and Disclosure
        </Typography>
        <Typography variant="body1" paragraph>
          We may share your personal information with third parties under the following circumstances:
        </Typography>
        <ul>
          <Typography component="li">With Brand Partners: We share participant information, submissions, and content with our contest brand partners (e.g., HBADA) for judging and promotional purposes.</Typography>
          <Typography component="li">With Service Providers: We engage third-party service providers for payment processing, shipping logistics, and communication services.</Typography>
          <Typography component="li">Legal Obligations: If required by law, legal processes, or governmental requests.</Typography>
          <Typography component="li">Business Transfers: In connection with mergers, acquisitions, or asset transfers.</Typography>
        </ul>
        <Typography variant="body1" paragraph>
          We do not sell, rent, or trade your personal information.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about this Privacy Policy, please contact us:
        </Typography>
        <Typography variant="body1">Email: contact@ocontest.net</Typography>
        <Typography variant="body1">Address: 354 Minhue Road, Binjiang District, Hangzhou, People's Republic of China</Typography>
        <Typography variant="body1">Phone: +86 151 6824 1304</Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" paragraph>
          Thank you for trusting Ocontest with your personal information. We value your privacy and are committed to protecting it.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
