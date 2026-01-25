/** auth routes*/
export const home = '/';
export const login = '/login';
export const forgot = '/forgot';
export const resetPassword = '/reset-password';
export const appUserResetPasswordPath = '/app-user-reset-password';
export const checkMail = '/check-mail';
export const codeVerification = '/code-verification';
export const authOtpVerification = '/auth-code-verification';
export const errorPage = '*';

/** main routes*/

export const adminList = '/admin/list';
export const adminAdd = '/admin/add';
export const adminProfile = 'admin/profile';
export const adminEdit = '/admin/edit/:id';
export const adminView = '/admin/view/:id';
export const adminAccountProfile = 'admin/account-profile';
export const adminChangePassword = 'admin/change-password';

/** AppUserRoutes*/

export const userList = 'user/list';
export const userProfile = 'user/profile/:id';
export const appUserList = 'app-user/list';
export const appUserAdd = 'app-user/add';
export const appUserProfile = 'app-user/profile/:id';
export const appUserTaskDetail = '/app-user/task-view/:id/:parentId/:appUserName';
export const appUserScheduleDetail = '/app-user/schedule-view/:id/:day/:parentId/:appUserName';
/** Dashboard routes*/

export const dashBoard = '/dashboard';

/** Template routes */
export const PresetTemplateListRoute = '/preset-template/list';
export const TaskTemplateAdd = '/preset-template/add-task-template';
export const TaskTemplateEdit = '/preset-template/edit-task-template';
export const ScheduleTemplateAdd = '/preset-template/add-schedule-template';
