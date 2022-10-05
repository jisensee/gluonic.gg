import { GraphQLResolveInfo } from 'graphql';
import { User as UserEntity, Socials as SocialsEntity } from '@prisma/client';
import { Context } from '@/server/graphql/resolvers';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  processProjectRequest: Maybe<Scalars['Boolean']>;
  requestProject: Scalars['Boolean'];
  updateOwnUser: User;
  updateProject: Scalars['Boolean'];
};


export type MutationProcessProjectRequestArgs = {
  isAccepted: Scalars['Boolean'];
  projectKey: InputMaybe<Scalars['String']>;
  requestId: Scalars['ID'];
};


export type MutationRequestProjectArgs = {
  data: ProjectRequestInput;
};


export type MutationUpdateOwnUserArgs = {
  data: OwnUserUpdateInput;
};


export type MutationUpdateProjectArgs = {
  data: ProjectUpdateInput;
  projectId: Scalars['ID'];
};

export type OwnUserUpdateInput = {
  bio: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  socials: SocialsInput;
};

export type ProjectBaseDataInput = {
  abstract: Scalars['String'];
  description: InputMaybe<Scalars['String']>;
  published: Scalars['Boolean'];
  website: Scalars['String'];
};

export type ProjectDonationInput = {
  donationAddress: InputMaybe<Scalars['String']>;
};

export type ProjectRequestInput = {
  abstract: Scalars['String'];
  gameId: Scalars['String'];
  name: Scalars['String'];
  website: Scalars['String'];
};

export type ProjectSocialsInput = {
  discord: InputMaybe<Scalars['String']>;
  github: InputMaybe<Scalars['String']>;
  twitter: InputMaybe<Scalars['String']>;
};

export type ProjectUpdateInput = {
  baseData: InputMaybe<ProjectBaseDataInput>;
  donationData: InputMaybe<ProjectDonationInput>;
  socials: InputMaybe<ProjectSocialsInput>;
};

export type Query = {
  __typename?: 'Query';
  currentUser: Maybe<User>;
};

export type Socials = {
  __typename?: 'Socials';
  discord: Maybe<Scalars['String']>;
  github: Maybe<Scalars['String']>;
  twitter: Maybe<Scalars['String']>;
  website: Maybe<Scalars['String']>;
};

export type SocialsInput = {
  discord: InputMaybe<Scalars['String']>;
  github: InputMaybe<Scalars['String']>;
  twitter: InputMaybe<Scalars['String']>;
  website: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  address: Maybe<Scalars['String']>;
  bio: Maybe<Scalars['String']>;
  hasDefaultName: Scalars['Boolean'];
  id: Scalars['ID'];
  isAdmin: Scalars['Boolean'];
  isProjectAuthor: Scalars['Boolean'];
  name: Scalars['String'];
  socials: Socials;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  OwnUserUpdateInput: OwnUserUpdateInput;
  ProjectBaseDataInput: ProjectBaseDataInput;
  ProjectDonationInput: ProjectDonationInput;
  ProjectRequestInput: ProjectRequestInput;
  ProjectSocialsInput: ProjectSocialsInput;
  ProjectUpdateInput: ProjectUpdateInput;
  Query: ResolverTypeWrapper<{}>;
  Socials: ResolverTypeWrapper<SocialsEntity>;
  SocialsInput: SocialsInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<UserEntity>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  OwnUserUpdateInput: OwnUserUpdateInput;
  ProjectBaseDataInput: ProjectBaseDataInput;
  ProjectDonationInput: ProjectDonationInput;
  ProjectRequestInput: ProjectRequestInput;
  ProjectSocialsInput: ProjectSocialsInput;
  ProjectUpdateInput: ProjectUpdateInput;
  Query: {};
  Socials: SocialsEntity;
  SocialsInput: SocialsInput;
  String: Scalars['String'];
  User: UserEntity;
}>;

export type ConstraintDirectiveArgs = {
  label: Maybe<Scalars['String']>;
  maxLength: Maybe<Scalars['Int']>;
  minLength: Maybe<Scalars['Int']>;
  required: Maybe<Scalars['Boolean']>;
};

export type ConstraintDirectiveResolver<Result, Parent, ContextType = Context, Args = ConstraintDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  processProjectRequest: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationProcessProjectRequestArgs, 'isAccepted' | 'requestId'>>;
  requestProject: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRequestProjectArgs, 'data'>>;
  updateOwnUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateOwnUserArgs, 'data'>>;
  updateProject: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'data' | 'projectId'>>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  currentUser: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type SocialsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Socials'] = ResolversParentTypes['Socials']> = ResolversObject<{
  discord: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  github: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitter: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasDefaultName: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isAdmin: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isProjectAuthor: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  socials: Resolver<ResolversTypes['Socials'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Mutation: MutationResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Socials: SocialsResolvers<ContextType>;
  User: UserResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  constraint: ConstraintDirectiveResolver<any, any, ContextType>;
}>;
