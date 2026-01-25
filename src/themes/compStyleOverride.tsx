// project imports
import { alpha, lighten, Theme } from '@mui/material/styles';
import { current } from '@reduxjs/toolkit';

// types
import { ThemeMode } from 'types/config';

export default function componentStyleOverrides(theme: Theme, borderRadius: number, outlinedFilled: boolean) {
    const mode = theme.palette.mode;

    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    borderRadius: '36px',
                    '&.pagination-button': {
                        border: `1px solid ${theme.palette.grey[50]}`,
                        borderRadius: 0,
                        padding: '12px 20px 12px 15px',
                        color: theme.palette.grey[900]
                    },
                    '&:hover': {
                        boxShadow: 'none'
                    }
                },
                sizeMedium: {
                    padding: '9px 24px',
                    lineHeight: 'calc(20 /14)'
                },
                sizeLarge: {
                    fontSize: theme.typography.body1.fontSize,
                    lineHeight: 'calc(23 / 16)',
                    padding: '16px 24px'
                },
                startIcon: {
                    marginLeft: 0,
                    marginRight: 16,
                    svg: {
                        path: {
                            fill: 'currentColor'
                        }
                    }
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.5)
                    }
                }
            }
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    '&.action-button': {
                        border: `1px solid ${theme.palette.primary.main}`,
                        color: theme.palette.primary.main,
                        padding: 7,

                        '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: lighten(theme.palette.primary.main, 0.5),
                            '.MuiSvgIcon-root': {
                                color: theme.palette.background.paper
                            }
                        },
                        '&.MuiIconButton-colorError': {
                            borderColor: theme.palette.error.dark,
                            color: theme.palette.error.dark,
                            '&:hover': {
                                borderColor: theme.palette.error.dark,
                                backgroundColor: theme.palette.error.dark
                            }
                        }
                    }
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '.MuiAlert-root &': {
                        color: 'currentColor'
                    }
                }
            }
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0
            },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    '.sidebar &': {
                        borderRight: `1px solid ${theme.palette.grey[300]}`
                    },
                    '&.MuiPopover-paper': {
                        '&.MuiMenu-paper': {
                            minWidth: 118,
                            '.MuiButtonBase-root': {
                                borderBottom: `1px solid ${theme.palette.grey[200]}`,
                                paddingTop: 8,
                                paddingBottom: 8
                            }
                        }
                    },
                    '&.user-setting': {
                        '.MuiTab-root': {
                            borderRadius: 2,
                            color: theme.palette.grey[800],
                            marginBottom: 8,
                            padding: 16,
                            gap: 4,

                            '&.Mui-selected, &:hover': {
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.background.default
                            },
                            '&.Mui-selected': {
                                borderRight: `2px solid ${theme.palette.primary.main}`
                            }
                        },
                        '.MuiDivider-root': {
                            borderColor: theme.palette.grey[200]
                        },
                        '.MuiGrid-item': {
                            '>.MuiBox-root': {
                                // paddingTop: 20,
                                paddingTop: 24,
                                paddingBottom: 20
                            }
                        }
                    },
                    '&.page-title': {
                        padding: '19px 20px',
                        marginBottom: 16
                    },
                    '&.tabset-list': {
                        padding: '16px 0',
                        '.MuiTab-root': {
                            borderRadius: 2,
                            color: theme.palette.grey[800],
                            marginBottom: 8,
                            gap: 4,

                            '&:last-child': {
                                marginBottom: 0
                            },

                            '&.Mui-selected, &:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.32),
                                color: theme.palette.grey[800]
                            },

                            '&.Mui-selected': {
                                borderRight: `2px solid ${theme.palette.primary.main}`
                            }
                        }
                    },
                    '&.tabset-content': {
                        padding: 20
                    },
                    '&.form-button-wrapper': {
                        marginTop: 16,
                        padding: '16px 20px',

                        '.MuiStack-root': {
                            justifyContent: 'flex-end',
                            gap: 16,
                            [theme.breakpoints.up('sm')]: {
                                flexDirection: 'row'
                            }
                        },
                        '&.justify-content-between': {
                            '.MuiStack-root': {
                                justifyContent: 'space-between'
                            }
                        }
                    }
                },
                rounded: {
                    borderRadius: `${borderRadius}px`
                }
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    color: theme.palette.text.dark,
                    padding: '20px',

                    '+ .MuiDivider-root': {
                        margin: '0 20px'
                    }
                },
                title: {
                    fontSize: theme.typography.h2.fontSize,
                    fontWeight: theme.typography.h2.fontWeight,

                    '.MuiStack-root': {
                        gap: 16,
                        [theme.breakpoints.up('sm')]: {
                            flexDirection: 'row'
                        },
                        [theme.breakpoints.up('md')]: {
                            justifyContent: 'flex-end'
                        },

                        '.MuiFormControl-root': {
                            [theme.breakpoints.up('sm')]: {
                                width: 213
                            }
                        },
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.grey[200]
                        },
                        '.MuiInputAdornment-root': {
                            '.MuiSvgIcon-root': {
                                color: theme.palette.primary.main
                            }
                        }
                    }
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '20px'
                }
            }
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    padding: '20px'
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    alignItems: 'center'
                },
                outlined: {
                    border: '1px dashed'
                },
                filledSuccess: {
                    backgroundColor: theme.palette.success.light
                }
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    'nav &': {
                        paddingTop: 0,
                        paddingBottom: 0
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: theme.palette.text.primary,
                    minWidth: '36px'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: theme.palette.text.dark
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: 0
                },
                input: {
                    color: theme.palette.text.dark,
                    fontWeight: theme.typography.body1.fontWeight,
                    padding: '14px 16px',
                    '&::placeholder': {
                        color: theme.palette.grey[500],
                        fontSize: theme.typography.body1.fontSize
                    }
                },
                inputSizeSmall: {
                    paddingTop: '9px',
                    paddingBottom: '9px'
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    borderRadius: 0,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === ThemeMode.DARK ? alpha(theme.palette.text.primary, 0.28) : theme.palette.grey[400]
                    },
                    '&:hover $notchedOutline': {
                        borderColor: theme.palette.primary.light
                    }
                },
                input: {
                    padding: '14px 16px',

                    '&::placeholder': {
                        color: theme.palette.grey[500]
                    }
                },
                inputSizeSmall: {
                    paddingTop: '9px',
                    paddingBottom: '9px'
                },
                inputAdornedStart: {
                    paddingLeft: 0
                },
                multiline: {
                    padding: 1
                }
            }
        },
        MuiInputAdornment: {
            styleOverrides: {
                positionStart: {
                    svg: {
                        path: {
                            fill: theme.palette.primary.main
                        }
                    }
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        color: mode === ThemeMode.DARK ? alpha(theme.palette.text.primary, 0.5) : theme.palette.grey[300]
                    }
                },
                mark: {
                    backgroundColor: theme.palette.background.paper,
                    width: '4px'
                },
                valueLabel: {
                    color: mode === ThemeMode.DARK ? theme.palette.primary.main : theme.palette.primary.light
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '& .MuiAutocomplete-tag': {
                        background: mode === ThemeMode.DARK ? alpha(theme.palette.text.primary, 0.2) : theme.palette.secondary.light,
                        borderRadius: 4,
                        color: theme.palette.text.dark,
                        '.MuiChip-deleteIcon': {
                            color: mode === ThemeMode.DARK ? alpha(theme.palette.text.primary, 0.8) : theme.palette.secondary[200]
                        }
                    }
                },
                popper: {
                    borderRadius: `${borderRadius}px`,
                    boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)'
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: theme.palette.divider
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    '&:focus': {
                        backgroundColor: 'transparent'
                    }
                },
                multiple: {
                    paddingTop: 8,
                    paddingBottom: 8,
                    minHeight: 35
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: mode === ThemeMode.DARK ? theme.palette.dark.main : theme.palette.primary.dark,
                    background: mode === ThemeMode.DARK ? theme.palette.text.primary : theme.palette.primary[200]
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    minWidth: 110,
                    padding: '4px 8px',
                    height: 29,
                    fontSize: theme.typography.body2.fontSize,

                    '&.MuiChip-deletable .MuiChip-deleteIcon': {
                        color: 'inherit'
                    },
                    '&.MuiChip-filledSuccess': {
                        backgroundColor: theme.palette.success.light,

                        '&:hover': {
                            backgroundColor: ThemeMode.DARK
                                ? alpha(theme.palette.success.main, 0.8)
                                : alpha(theme.palette.success.main, 0.12)
                        }
                    },
                    '&.MuiChip-colorSuccess, &.MuiChip-colorError': {
                        color: theme.palette.grey[800],
                        '&:hover': {
                            color: theme.palette.grey[800]
                        }
                    },
                    '&.MuiChip-filledError': {
                        backgroundColor: theme.palette.error.main,
                        '&:hover': {
                            backgroundColor: ThemeMode.DARK ? alpha(theme.palette.error.dark, 0.9) : alpha(theme.palette.error.dark, 0.12)
                        }
                    }
                },
                label: {
                    color: mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.text.dark
                }
            }
        },
        MuiTimelineContent: {
            styleOverrides: {
                root: {
                    color: theme.palette.text.dark,
                    fontSize: '16px'
                }
            }
        },
        MuiTreeItem: {
            styleOverrides: {
                label: {
                    marginTop: 14,
                    marginBottom: 14
                }
            }
        },
        MuiTimelineDot: {
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                }
            }
        },
        MuiInternalDateTimePickerTabs: {
            styleOverrides: {
                tabs: {
                    backgroundColor: mode === ThemeMode.DARK ? theme.palette.dark[900] : theme.palette.primary.light,
                    '& .MuiTabs-flexContainer': {
                        borderColor: mode === ThemeMode.DARK ? alpha(theme.palette.text.primary, 0.2) : theme.palette.primary[200]
                    },
                    '& .MuiTab-root': {
                        color: mode === ThemeMode.DARK ? theme.palette.text.secondary : theme.palette.grey[900]
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: theme.palette.primary.dark
                    },
                    '& .Mui-selected': {
                        color: theme.palette.primary.dark
                    }
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    '&.profile-tab': {
                        flex: 1,

                        '.MuiTab-root': {
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[800],
                            minHeight: 'auto',
                            minWidth: '100%',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                            borderRadius: 2,
                            lineHeight: 1.75,
                            '&.Mui-selected': {
                                color: theme.palette.background.default,
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
                            },
                            '> .MuiTab-iconWrapper': {
                                marginBottom: 0,
                                marginRight: 1.25,
                                marginTop: 1.25,
                                height: 24,
                                width: 24
                            }
                        }
                    }
                },
                flexContainer: {
                    borderBottom: '1px solid',
                    borderColor: mode === ThemeMode.DARK ? alpha(theme.palette.text.primary, 0.2) : theme.palette.grey[200],
                    '.profile-tab &': {
                        borderBottom: 0,
                        borderRight: `1px solid ${theme.palette.grey[200]}`,
                        height: '100%',
                        paddingRight: 24,
                        paddingTop: 16
                    }
                },
                indicator: {
                    '.profile-tab &': {
                        display: 'none'
                    }
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    padding: '12px 0 12px 0'
                }
            }
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    color: theme.palette.text.primary
                }
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    '.MuiStack-root': {
                        '.taxons-dailog &': {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 8,
                            gap: 16
                        }
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: mode === ThemeMode.DARK ? alpha(theme.palette.text.primary, 0.15) : theme.palette.grey[50],
                    '.MuiChip-label': {
                        textTransform: 'lowercase',
                        '&:first-letter': {
                            textTransform: 'uppercase'
                        }
                    }
                },
                head: {
                    fontSize: theme.typography.h6.fontSize,
                    fontWeight: theme.typography.h6.fontWeight,
                    color: mode === ThemeMode.DARK ? theme.palette.grey[600] : theme.palette.grey[500],
                    padding: '12px 16px 9px',
                    '&:first-of-type': {
                        paddingLeft: 9
                    }
                },
                body: {
                    padding: '8px 16px',
                    '&:first-of-type': {
                        paddingLeft: 9
                    }
                }
            }
        },
        MuiDateTimePickerToolbar: {
            styleOverrides: {
                timeDigitsContainer: {
                    alignItems: 'center'
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    color: theme.palette.background.paper,
                    background: theme.palette.text.primary
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: '1.25rem'
                }
            }
        },
        MuiPagination: {
            styleOverrides: {
                ul: {
                    backgroundColor: theme.palette.grey[50],
                    borderRadius: 12,
                    padding: '8.5px 8px'
                }
            }
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    margin: '0 4px',
                    fontSize: theme.typography.h6.fontSize,
                    fontWeight: theme.typography.h6.fontWeight,
                    minWidth: 30,
                    height: 30,
                    borderRadius: 4,
                    backgroundColor: theme.palette.background.paper,

                    '&.Mui-selected': {
                        minWidth: 22,
                        height: 22,
                        color: theme.palette.background.paper
                    }
                },
                ellipsis: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 20
                },
                previousNext: {
                    borderRadius: '50%',
                    minWidth: 0,
                    width: 24,
                    height: 24
                }
            }
        },
        MuiDataGrid: {
            defaultProps: {
                rowHeight: 54
            },
            styleOverrides: {
                root: {
                    borderWidth: 0,
                    '& .MuiDataGrid-columnHeader--filledGroup': {
                        borderBottomWidth: 0
                    },
                    '& .MuiDataGrid-columnHeader--emptyGroup': {
                        borderBottomWidth: 0
                    },
                    '& .MuiFormControl-root>.MuiInputBase-root': {
                        backgroundColor: `${theme.palette.background.default} !important`,
                        borderColor:
                            mode === ThemeMode.DARK
                                ? `${alpha(theme.palette.divider, 0.05)} !important`
                                : `${theme.palette.divider} !important`
                    }
                },
                toolbarContainer: {
                    '& .MuiButton-root': {
                        paddingLeft: '16px !important',
                        paddingRight: '16px !important'
                    }
                },
                withBorderColor: {
                    borderBottom: '1px solid',
                    borderColor: mode === ThemeMode.DARK ? alpha(theme.palette.divider, 0.15) : theme.palette.divider
                },
                columnHeader: {
                    color: theme.palette.grey[600],
                    paddingLeft: 24,
                    paddingRight: 24
                },
                footerContainer: {
                    '&.MuiDataGrid-withBorderColor': {
                        borderBottom: 'none'
                    }
                },
                columnHeaderCheckbox: {
                    paddingLeft: 0,
                    paddingRight: 0
                },
                cellCheckbox: {
                    paddingLeft: 0,
                    paddingRight: 0
                },
                cell: {
                    borderWidth: 0,
                    paddingLeft: 24,
                    paddingRight: 24,
                    '&.MuiDataGrid-cell--withRenderer > div ': {
                        ...(mode === ThemeMode.DARK && {
                            color: theme.palette.grey[50]
                        }),
                        ' > .high': {
                            background: mode === ThemeMode.DARK ? theme.palette.success.dark : theme.palette.success.light
                        },
                        '& > .medium': {
                            background: mode === ThemeMode.DARK ? theme.palette.warning.dark : theme.palette.warning.light
                        },
                        '& > .low': {
                            background: mode === ThemeMode.DARK ? theme.palette.error.dark : theme.palette.error.light
                        }
                    }
                }
            }
        },
        MuiGrid: {
            styleOverrides: {
                root: {
                    '&.menu-item-drag': {},
                    '.drag-wrapper': {
                        width: '100%',

                        '.drag-wrapper': {
                            paddingLeft: 8,

                            [theme.breakpoints.up('sm')]: {
                                paddingLeft: 40
                            },

                            '.drag-element': {
                                marginBottom: 0
                            }
                        }
                    },
                    '.drag-element': {
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: 40
                    },
                    '.menu-item': {
                        backgroundColor: theme.palette.secondary.light,
                        width: '100%',
                        borderRadius: '4px',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '8px',
                        gap: 2,
                        flex: 1,
                        flexWrap: 'wrap',

                        '.heading-main': {
                            flex: 1
                        },

                        '.MuiStack-root': {
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        },

                        '+ .MuiBox-root > div': {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }
                    }
                }
            }
        },
        MuiModal: {
            styleOverrides: {
                root: {
                    '&.menu-modal': {
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: 472,
                        margin: '0 auto',

                        '.MuiPaper-root': {
                            padding: 24
                        }
                    },
                    '&.cropimage-modal': {
                        '.cropper-drag-box': {
                            borderRadius: 8
                        },
                        '.MuiBox-root': {
                            backgroundColor: theme.palette.background.paper,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            maxWidth: 620,
                            minWidth: 280,
                            width: '100%',
                            padding: '20px',
                            borderRadius: '8px',
                            maxHeight: '90%',
                            overflowY: 'auto'
                        },
                        '.button-wrapper-row': {
                            marginTop: 20
                        }
                    }
                }
            }
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '.MuiInputLabel-root': {
                        position: 'static',
                        transform: 'none',
                        fontSize: theme.typography.body2.fontSize,

                        '+.MuiInputBase-formControl': {
                            '.MuiInputBase-input': {
                                '&::placeholder': {
                                    opacity: '1 !important'
                                }
                            }
                        }
                    },
                    '&.update-date-button': {
                        '.MuiInputBase-input.MuiSelect-select': {
                            fontSize: theme.typography.body2.fontSize,
                            padding: '9px 14px 9px 25px',
                            color: theme.palette.primary.main
                        },
                        '.MuiInputBase-root': {
                            borderRadius: 36
                        },
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main
                        },
                        '.icon-holder': {
                            paddingTop: 4,
                            paddingRight: 25
                        }
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: theme.palette.grey[800]
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontSize: theme.typography.body2.fontSize,

                    '&.MuiInputLabel-root': {
                        fontWeight: theme.typography.body2.fontWeight,
                        marginBottom: 4
                    }
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                root: {
                    '> .MuiPaper-root': {
                        'nav &': {
                            backgroundColor: mode === ThemeMode.DARK ? theme.palette.background.paper : theme.palette.primary.main
                        }
                    }
                }
            }
        },
        MuiStack: {
            styleOverrides: {
                root: {
                    '&.custom-pagination': {
                        marginTop: 24,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 16
                    },
                    '&.button-wrapper-row': {
                        justifyContent: 'space-between',
                        gap: 16,
                        [theme.breakpoints.up('sm')]: {
                            flexDirection: 'row'
                        }
                    },
                    '&.avatar-wrapper': {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 16,
                        position: 'relative',

                        'input[type="file"]': {
                            display: 'block',
                            width: 80,
                            height: 80,
                            opacity: 0,
                            position: 'absolute'
                        }
                    },
                    '&.custom-breadcrumb': {
                        '.MuiBox-root': {
                            padding: '9.5px 16px'
                        }
                    },
                    '&.profile-tab': {
                        width: '100%',
                        flexDirection: 'row',
                        '.MuiTabs-vertical': {
                            width: 235,
                            '+ div': {
                                flex: 1
                            }
                        }
                    }
                }
            }
        },
        MuiBreadcrumbs: {
            styleOverrides: {
                li: {
                    '.MuiTypography-subtitle1': {
                        fontWeight: 400,
                        color: theme.palette.grey[800]
                    },
                    '&:last-child': {
                        '.MuiTypography-subtitle1': {
                            color: theme.palette.primary.main
                        }
                    }
                }
            }
        },
        MuiCollapse: {
            styleOverrides: {
                root: {
                    'nav &, .MuiDrawer-paperAnchorLeft &': {
                        backgroundColor:
                            mode === ThemeMode.DARK ? alpha(theme.palette.primary.main, 0.16) : lighten(theme.palette.primary.main, 0.5),
                        marginTop: -4,
                        borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
                        padding: 0,
                        overflow: 'hidden',

                        '.MuiCollapse-root': {
                            marginTop: 0,
                            overflow: 'hidden',
                            '.MuiListItemButton-root': {
                                paddingLeft: 42
                            }
                        },

                        '.MuiListItemButton-root': {
                            padding: '6px 12px 6px 46px',
                            marginBottom: 0,
                            borderRadius: 0,

                            '&:hover,&.Mui-selected': {
                                backgroundColor:
                                    mode === ThemeMode.DARK
                                        ? alpha(theme.palette.primary.main, 0.16)
                                        : alpha(theme.palette.primary.main, 0.5)
                            },

                            '>.MuiListItemIcon-root, >.MuiButtonBase-root': {
                                display: 'none'
                            }
                        },

                        '.MuiTypography-root': {
                            fontSize: theme.typography.body2.fontSize
                        }
                    }
                }
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    '&.Mui-error': {
                        color: theme.palette.error.dark
                    }
                }
            }
        }
    };
}
