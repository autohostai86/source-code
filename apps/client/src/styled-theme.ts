/** @format */

// NOTE: define your custome theme variables here
/**
 * for any height , width, margin , color
 * define variables as primary, secondary, ternary or large, medium, small
 * below variables defined for demo only please define as per your preference
 */

import { createTheme } from '@mui/material/styles';

// Define your theme
const theme = createTheme({
  palette: {
    mode: 'light', // Set the initial mode, or fetch it from your settings
    grey: {
      100: '#f0f0f0',
      600: '#2ECA45',
      // Define other shades of grey if needed
    },
    // Define other colors as needed
  },
  // Define other theme options as needed
}); 

const StyledTheme = {
    HEIGHT_LARGE: '10rem',
    HEIGHT_MEDIUM: '7rem',
    HEIGHT_SMALL: '4rem',

    COLOR_PRIMARY: 'blue',

    TEXT_ALIGN_LEFT: 'left',
    TEXT_ALIGN_CENTER: 'center',
    TEXT_ALIGN_RIGHT: 'right',

    LIST_STYLE_NONE: 'none',

    RELATIVE_SIZE_EXTRA_SMALL: '15%',
    RELATIVE_SIZE_SMALL: '25%',
    RELATIVE_SIZE_MEDIUM: '50%',
    RELATIVE_SIZE_LARGE: '75%',
    RELATIVE_SIZE_LARGER: '100%',

    ABSOLUTE_SIZE_EXTRA_SMALL: '15px',
    ABSOLUTE_SIZE_SMALL: '25px',
    ABSOLUTE_SIZE_MEDIUM: '30px',
    ABSOLUTE_SIZE_LARGE: '40px',
    ABSOLUTE_SIZE_LARGER: '50px',

    MARGIN_EXTRA_SMALL: '0.7rem',
    PADDING_EXTRA_SMALL: '0.7rem',

    // values from template theme check gogo.dark.custom.scss file
    THEME_COLOR_1: '#d9fdea',
    FOREGROUND_COLOR: '#fafaff',
    ...theme
};
export default StyledTheme;
