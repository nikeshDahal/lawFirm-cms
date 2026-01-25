import { Grid, List, Stack, Tabs, styled } from "@mui/material";

export const ProfileTabs = styled(Tabs)(({ theme }) => ({
    flex: 1,

    '.MuiTabs-flexContainer': {
        borderBottom: 'none'
    },

    '.MuiTab-root': {
        color: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[600],
        minHeight: 'auto',
        minWidth: '100%',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        textAlign: 'left',
        justifyContent: 'flex-start',
        borderRadius: `${theme.shape.borderRadius}px`,
        '&.Mui-selected': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50]
        },
        '> .MuiTab-iconWrapper': {
            marginBottom: 0,
            marginRight: 1.25,
            marginTop: 1.25,
            height: 20,
            width: 20   
        },
    },

    '.MuiTabs-indicator': {
        display: 'none'
    }
}));

export const AvatarWrapper = styled(Stack)(( {theme} ) => ({
    flexDirection: "row",
    alignItems: "center",
    gap: 24
}));

export const UnorderList = styled(List)({
    listStyle: 'unset',
    paddingLeft: "16px",

    '.MuiListItem-root': { 
        display: 'list-item', 
        padding: 0 
    }
});

export const MetaButtonWrapper = styled(Grid)(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    flexDirection: 'column',
    [theme.breakpoints.up("sm")]: {
        flexDirection: 'row',
    }
}));