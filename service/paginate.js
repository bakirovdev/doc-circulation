require('dotenv').config()
module.exports = {
    paginate: function (req) {
        let page = parseInt(req.query.page || 1)
        const limit = process.env.NODE_PG || process.env.NODE_PG

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const data_ = {}
        const url = `${process.env.NODE_HOST_SECURE}${process.env.NODE_IS_HOST}:${process.env.NODE_PORT}`
        data_.data = req.data.slice(startIndex, endIndex)
        const lastPage = Math.ceil(req.data.length / limit)
        data_.links = {
            first: `${url}${req.baseUrl}${req.url}?page=1`,
            last: `${url}${req.baseUrl}${req.url}?page=${lastPage}`,
            prev: page > 1 ? `${url}${req.baseUrl}${req.url}?page=${page - 1}` : null,
            next: page < lastPage ? `${url}${req.baseUrl}${req.url}?page=${page + 1}` : null
        }
        data_.meta = {
            current_page: page,
            from: endIndex,
            last_page: lastPage,
            links: generateLinks(url, lastPage, page, req.baseUrl, req.url)
        }
        data_.path = `${url}${req.baseUrl}${req.url}`
        data_.per_page = 1 * limit;
        data_.total = req.data.length;
        return data_
    }
}

generateLinks = (base_url, maxPageNumber, activePage, url, route_url) => {
    const links = [];
    for (let i = 1; i <= maxPageNumber; i++) {
        links.push({
            url: `${base_url}${url}${route_url}?page=${i}`,
            label: i,
            active: i == activePage ? true : false
        })
    }
    return links
}