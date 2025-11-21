export interface IRes<T = any> {
  data?: T;
  message: string;
  [key: string]: any;
}

export interface IResListData<T = any> extends IRes<T> {
  total: number;
  limit: number;
  page: number;
}

export enum EOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export const EOrderBy = {
  ID: 'id',
  CREATED_DATE: 'createdAt',
} as const;
export type EOrderBy = (typeof EOrderBy)[keyof typeof EOrderBy];
