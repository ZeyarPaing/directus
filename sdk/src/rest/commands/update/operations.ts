import type { DirectusOperation } from '../../../schema/operation.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { queryToParams } from '../../utils/query-to-params.js';


export type UpdateOperationOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item = DirectusOperation<Schema>
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update multiple existing operations.
 * @param keys 
 * @param item 
 * @param query 
 * @returns Returns the operation objects for the updated operations.
 */
export const updatedOperations =
	<Schema extends object, TQuery extends Query<Schema, DirectusOperation<Schema>>>(
		keys: DirectusOperation<Schema>['id'][],
		item: Partial<DirectusOperation<Schema>>,
		query?: TQuery
	): RestCommand<UpdateOperationOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: `/operations`,
		params: queryToParams(query ?? {}),
		body: JSON.stringify({ keys, data: item }),
		method: 'PATCH',
	});

/**
 * Update an existing operation.
 * @param key 
 * @param item 
 * @param query 
 * @returns Returns the operation object for the updated operation.
 */
export const updateOperation =
	<Schema extends object, TQuery extends Query<Schema, DirectusOperation<Schema>>>(
		key: DirectusOperation<Schema>['id'],
		item: Partial<DirectusOperation<Schema>>,
		query?: TQuery
	): RestCommand<UpdateOperationOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: `/operations/${key}`,
		params: queryToParams(query ?? {}),
		body: JSON.stringify(item),
		method: 'PATCH',
	});