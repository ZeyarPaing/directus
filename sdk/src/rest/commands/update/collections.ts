import type { DirectusCollection } from '../../../schema/collection.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { queryToParams } from '../../utils/query-to-params.js';


export type UpdateCollectionOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item = DirectusCollection<Schema>
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update the metadata for an existing collection.
 * @param collection 
 * @param item 
 * @param query 
 * @returns The collection object for the updated collection in this request.
 */
export const updateCollection =
	<Schema extends object, TQuery extends Query<Schema, DirectusCollection<Schema>>>(
		collection: DirectusCollection<Schema>['collection'],
		item: Partial<DirectusCollection<Schema>>,
		query?: TQuery
	): RestCommand<UpdateCollectionOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: `/collections/${collection}`,
		params: queryToParams(query ?? {}),
		body: JSON.stringify(item),
		method: 'PATCH',
	});