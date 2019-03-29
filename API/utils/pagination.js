/**
 * @file This file contains the addPaginationMetaData utility function.
 *
 * @author Emiel Pasman
 * @author Andrés Salinas Lima
 * @author Stefan Valeanu
 */

'use strict';

module.exports = {
	addPaginationMetaData
}

/**
 * Adds the pagination metadata to the output.
 *
 * @param baseURL         URL piece to be placed at the beginning of all the links
 * @param dataArray       Array that contains only the elements to be returned
 * @param total_count     Total number of elements in the original array
 * @param page_number     Number of the current page
 * @param per_page        Number of items per page
 * @param [extra_url=""]  URL piece to be placed at the end of all the links
 *
 * @return {Object}       Object with the paginated result ready to be sent to the client as json
 */
function addPaginationMetaData(baseURL, dataArray, total_count, page_number, per_page, extra_url="")
{
	if(dataArray.length == 0)
		throw new Error("Pagination error");

	var result = {};

	result.page_number = parseInt(page_number);

	result.per_page = parseInt(per_page);

	result.total_count = parseInt(total_count);

	result.total_pages = Math.ceil(result.total_count/result.per_page);

	result.last_page = baseURL + "?page=" + result.total_pages + "&per_page=" + result.per_page + extra_url;

	if(result.page_number > 1)
		result.previous_page = baseURL + "?page=" + (result.page_number-1).toString() + "&per_page=" + result.per_page + extra_url;

	if(result.page_number != result.total_pages)
		result.next_page = baseURL + "?page=" + (result.page_number+1).toString() + "&per_page=" + result.per_page + extra_url;

	result.data = dataArray;

	return result;
}
