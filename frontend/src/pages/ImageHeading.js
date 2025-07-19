import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ImageHeadingText = ({ 
  imageSrc, 
  imageAlt, 
  title, 
  align = 'center', // 'center' or 'left'
  imageHeight = '80px',
  spacing = 3,
  maxWidth = '800px',
  minwidth = "800px",
  imageStyle = {},
}) => {
return (
  <>
    {/* Image */}
    {imageSrc && (
      <img 
        src={imageSrc} 
        alt={imageAlt || title} 
        style={{ 
          display: 'block',           // Makes margin: auto work
          margin: '0 auto',           // Center horizontally
          width: '40%',              // Expand to full container width
          maxWidth: '40%',           // Prevent overflow
          height: '200px',             // Maintain aspect ratio
          objectFit: 'contain',
          minWidth: "350px",
          ...imageStyle
        }} 
      />
    )}
  </>
);

};

ImageHeadingText.propTypes = {
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleVariant: PropTypes.string,
  textVariant: PropTypes.string,
  align: PropTypes.oneOf(['center', 'left']),
  imageHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  spacing: PropTypes.number,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imageStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  textStyle: PropTypes.object
};

export default ImageHeadingText;
