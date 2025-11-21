/**
 *
 * Enum representing the different roles in the system.
 * This enum defines the available user roles that can be assigned in the application.
 * Each role corresponds to a specific level of access and permissions.
 */
export enum ERole {
  /**
   *
   * Administrator role with full access to the system.
   * Typically used for users who manage and configure the system.
   */
  ADMINISTRATOR = 'ADMINISTRATOR',

  /**
   *
   * Guest role with limited access.
   * Typically used for users who are not logged in or have restricted permissions.
   */
  GUEST = 'GUEST',
}

/**
 *
 * Array of roles available in the system.
 * This array is used to define all the roles that a user can be assigned within the application.
 * It includes both the Administrator and Guest roles.
 */
export const ROLES = [ERole.ADMINISTRATOR, ERole.GUEST];

/**
 *
 * Enum representing access permissions in the system.
 * Each permission defines a specific action or operation that can be performed.
 */
export enum ACCESS {
  // System
  SEND_MAIL_TEST = 'SEND_MAIL_TEST',

  // User Module
  CREATE_USER = 'CREATE_USER',
  LIST_USER = 'LIST_USER',
  VIEW_USER = 'VIEW_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  SOFT_DELETE_USER = 'SOFT_DELETE_USER',
  RESTORE_USER = 'RESTORE_USER',

  // Role Module
  LIST_ROLE = 'LIST_ROLE',
  LIST_PERMISSION = 'LIST_PERMISSION',
  CREATE_ROLE = 'CREATE_ROLE',
  UPDATE_ROLE = 'UPDATE_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',

  // Media Module
  UPLOAD_FILE = 'UPLOAD_FILE',

  // Product Module
  CREATE_PRODUCT = 'CREATE_PRODUCT',
  LIST_PRODUCT = 'LIST_PRODUCT',
  VIEW_PRODUCT = 'VIEW_PRODUCT',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  SOFT_DELETE_PRODUCT = 'SOFT_DELETE_PRODUCT',
  RESTORE_PRODUCT = 'RESTORE_PRODUCT',
  PUBLISH_PRODUCT = 'PUBLISH_PRODUCT',
  UNPUBLISH_PRODUCT = 'UNPUBLISH_PRODUCT',
}

/**
 *
 * Array of grouped permissions in the system.
 * Used to categorize permissions by their respective modules.
 */
export const PERMISSIONS = [
  {
    group: 'SYSTEM',
    permissions: [ACCESS.SEND_MAIL_TEST],
  },
  {
    group: 'USER',
    permissions: [
      ACCESS.CREATE_USER,
      ACCESS.LIST_USER,
      ACCESS.VIEW_USER,
      ACCESS.UPDATE_USER,
      ACCESS.DELETE_USER,
      ACCESS.SOFT_DELETE_USER,
      ACCESS.RESTORE_USER,
    ],
  },
  {
    group: 'ROLE',
    permissions: [
      ACCESS.LIST_ROLE,
      ACCESS.LIST_PERMISSION,
      ACCESS.CREATE_ROLE,
      ACCESS.UPDATE_ROLE,
      ACCESS.DELETE_ROLE,
    ],
  },
  {
    group: 'MEDIA',
    permissions: [ACCESS.UPLOAD_FILE],
  },
  {
    group: 'PRODUCT',
    permissions: [
      ACCESS.CREATE_PRODUCT,
      ACCESS.LIST_PRODUCT,
      ACCESS.VIEW_PRODUCT,
      ACCESS.UPDATE_PRODUCT,
      ACCESS.DELETE_PRODUCT,
      ACCESS.SOFT_DELETE_PRODUCT,
      ACCESS.RESTORE_PRODUCT,
      ACCESS.PUBLISH_PRODUCT,
      ACCESS.UNPUBLISH_PRODUCT,
    ],
  },
];
