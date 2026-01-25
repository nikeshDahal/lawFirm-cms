// material-ui
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */
import logoDark from 'assets/images/logo-dark.svg';
import logo from 'assets/images/logo.svg';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();
    let settings = useSelector((state: any) => state.settings.settings);
    let logoUrl = logo;
    if (settings) {
        for (let field of settings) {
            if (field.slug === 'logo-field') {
                logoUrl = field.value;
            }
        }
    }

    return <img src={logoUrl} alt="logo" width="150" height="45" />;
};

export default Logo;
