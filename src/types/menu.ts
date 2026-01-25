import { NavItemType } from 'types';
// ==============================|| MENU TYPES ||============================== //

export type MenuProps = {
    /**
     * Indicate if dashboard layout menu open or not
     */
    isDashboardDrawerOpened: boolean; //default option
    selectedItem: string[];
    selectedID: string | null;
    drawerOpen: boolean;
    error: null;
    menu: NavItemType;
};

export type EditorSubmit = {
    title: string;
    logo: string;
    imageAltText: string;
};

export type FileUploadParams = {
    event: any;
    uploadFunction: any;
    contentType: string;
    awsFolderPath: string;
};

export type FileType = {
    name: string;
    objectKey: string;
    contentType: string;
};

export type InitialValueMenu = {
    title: string;
    imageAltText: string;
    status: string;
    menuPosition: string;
};

export type HeadCell = {
    id: string;
    label: string;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;
    padding?: 'checkbox' | 'none' | 'normal' | undefined;
};

export type EditorSubmit1 = {
    title: string;
    slug: string;
    status: PageStatus | string;
};

export enum PageStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}
