'use strict';

module.exports = {
    addPaginationMetaData
}

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
