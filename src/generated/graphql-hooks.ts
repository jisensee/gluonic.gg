import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("/api/graphql" as string, {
    method: "POST",
    ...({"headers":{"Content-Type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateOwnUser: User;
  updateProject: Scalars['Boolean'];
};


export type MutationUpdateOwnUserArgs = {
  data: OwnUserUpdateInput;
};


export type MutationUpdateProjectArgs = {
  data: ProjectUpdateInput;
  projectId: Scalars['ID'];
};

export type OwnUserUpdateInput = {
  bio?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  socials: SocialsInput;
};

export type ProjectBaseDataInput = {
  abstract: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  published: Scalars['Boolean'];
  website: Scalars['String'];
};

export type ProjectDonationInput = {
  donationAddress?: InputMaybe<Scalars['String']>;
};

export type ProjectSocialsInput = {
  discord?: InputMaybe<Scalars['String']>;
  github?: InputMaybe<Scalars['String']>;
  twitter?: InputMaybe<Scalars['String']>;
};

export type ProjectUpdateInput = {
  baseData?: InputMaybe<ProjectBaseDataInput>;
  donationData?: InputMaybe<ProjectDonationInput>;
  socials?: InputMaybe<ProjectSocialsInput>;
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
};

export type Socials = {
  __typename?: 'Socials';
  discord?: Maybe<Scalars['String']>;
  github?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type SocialsInput = {
  discord?: InputMaybe<Scalars['String']>;
  github?: InputMaybe<Scalars['String']>;
  twitter?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  hasDefaultName: Scalars['Boolean'];
  id: Scalars['ID'];
  isProjectAuthor: Scalars['Boolean'];
  name: Scalars['String'];
  socials: Socials;
};

export type OwnUserDataFragment = { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, address?: string | null | undefined, hasDefaultName: boolean, isProjectAuthor: boolean, socials: { __typename?: 'Socials', website?: string | null | undefined, twitter?: string | null | undefined, github?: string | null | undefined, discord?: string | null | undefined } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, address?: string | null | undefined, hasDefaultName: boolean, isProjectAuthor: boolean, socials: { __typename?: 'Socials', website?: string | null | undefined, twitter?: string | null | undefined, github?: string | null | undefined, discord?: string | null | undefined } } | null | undefined };

export type UpdateOwnUserMutationVariables = Exact<{
  data: OwnUserUpdateInput;
}>;


export type UpdateOwnUserMutation = { __typename?: 'Mutation', updateOwnUser: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, address?: string | null | undefined, hasDefaultName: boolean, isProjectAuthor: boolean, socials: { __typename?: 'Socials', website?: string | null | undefined, twitter?: string | null | undefined, github?: string | null | undefined, discord?: string | null | undefined } } };

export type UpdateProjectMutationVariables = Exact<{
  projectId: Scalars['ID'];
  data: ProjectUpdateInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: boolean };

export const OwnUserDataFragmentDoc = `
    fragment OwnUserData on User {
  id
  name
  bio
  address
  hasDefaultName
  isProjectAuthor
  socials {
    website
    twitter
    github
    discord
  }
}
    `;
export const CurrentUserDocument = `
    query CurrentUser {
  currentUser {
    ...OwnUserData
  }
}
    ${OwnUserDataFragmentDoc}`;
export const useCurrentUserQuery = <
      TData = CurrentUserQuery,
      TError = unknown
    >(
      variables?: CurrentUserQueryVariables,
      options?: UseQueryOptions<CurrentUserQuery, TError, TData>
    ) =>
    useQuery<CurrentUserQuery, TError, TData>(
      variables === undefined ? ['CurrentUser'] : ['CurrentUser', variables],
      fetcher<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, variables),
      options
    );
export const UpdateOwnUserDocument = `
    mutation UpdateOwnUser($data: OwnUserUpdateInput!) {
  updateOwnUser(data: $data) {
    ...OwnUserData
  }
}
    ${OwnUserDataFragmentDoc}`;
export const useUpdateOwnUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateOwnUserMutation, TError, UpdateOwnUserMutationVariables, TContext>) =>
    useMutation<UpdateOwnUserMutation, TError, UpdateOwnUserMutationVariables, TContext>(
      ['UpdateOwnUser'],
      (variables?: UpdateOwnUserMutationVariables) => fetcher<UpdateOwnUserMutation, UpdateOwnUserMutationVariables>(UpdateOwnUserDocument, variables)(),
      options
    );
export const UpdateProjectDocument = `
    mutation UpdateProject($projectId: ID!, $data: ProjectUpdateInput!) {
  updateProject(projectId: $projectId, data: $data)
}
    `;
export const useUpdateProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>) =>
    useMutation<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>(
      ['UpdateProject'],
      (variables?: UpdateProjectMutationVariables) => fetcher<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, variables)(),
      options
    );