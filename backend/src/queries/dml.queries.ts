/** Types generated for queries found in "src/queries/dml.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type friendship_status = 'accepted' | 'blocked' | 'pending';

/** 'SelectUsers' parameters type */
export type ISelectUsersParams = void;

/** 'SelectUsers' return type */
export interface ISelectUsersResult {
  email: string;
  id: number;
  name: string;
  passwordHash: string | null;
  profilePictureId: string;
  spotifyId: string | null;
  username: string;
}

/** 'SelectUsers' query type */
export interface ISelectUsersQuery {
  params: ISelectUsersParams;
  result: ISelectUsersResult;
}

const selectUsersIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT *\n  FROM users"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 *   FROM users
 * ```
 */
export const selectUsers = new PreparedQuery<ISelectUsersParams,ISelectUsersResult>(selectUsersIR);


/** 'LoginUser' parameters type */
export interface ILoginUserParams {
  email: string;
  password: string;
}

/** 'LoginUser' return type */
export interface ILoginUserResult {
  id: number;
}

/** 'LoginUser' query type */
export interface ILoginUserQuery {
  params: ILoginUserParams;
  result: ILoginUserResult;
}

const loginUserIR: any = {"usedParamSet":{"email":true,"password":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":38,"b":44}]},{"name":"password","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":92}]}],"statement":"SELECT id\n  FROM users\n WHERE email = :email!\n   AND check_password(password_hash, :password!)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id
 *   FROM users
 *  WHERE email = :email!
 *    AND check_password(password_hash, :password!)
 * ```
 */
export const loginUser = new PreparedQuery<ILoginUserParams,ILoginUserResult>(loginUserIR);


/** 'GetFriendships' parameters type */
export interface IGetFriendshipsParams {
  id: number;
}

/** 'GetFriendships' return type */
export interface IGetFriendshipsResult {
  status: friendship_status;
}

/** 'GetFriendships' query type */
export interface IGetFriendshipsQuery {
  params: IGetFriendshipsParams;
  result: IGetFriendshipsResult;
}

const getFriendshipsIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":107,"b":110}]}],"statement":"SELECT f.status\n  FROM friendships f\n           LEFT JOIN public.users u ON u.id = f.user_id\n WHERE u.id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT f.status
 *   FROM friendships f
 *            LEFT JOIN public.users u ON u.id = f.user_id
 *  WHERE u.id = :id!
 * ```
 */
export const getFriendships = new PreparedQuery<IGetFriendshipsParams,IGetFriendshipsResult>(getFriendshipsIR);


