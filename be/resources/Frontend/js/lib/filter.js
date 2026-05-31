"use strict";

function serializeQuery(oldQuery = {}, newQuery = {}) {
    return { ...serializeOldQuery(oldQuery), ...serializeNewQuery(newQuery) };
}

function serializeOldQuery(query = {}) {
    return Object.fromEntries(
        Object.entries(query).filter(([key]) => !key.includes("opt-"))
    );
}

function serializeNewQuery(query = {}) {
    return {
        ...serializeOptions(query),
        ...Object.fromEntries(
            Object.entries(query).filter(([key, x]) => typeof x === "string")
        ),
    };
}

function serializeOptions(options) {
    let queryOptions = [];
    for (const option of options) {
        const childIds = option.nodes
            ? option.nodes.filter((c) => c.active).map((x) => x.id)
            : [];

        if (childIds.length > 0) {
            queryOptions = [...queryOptions, ...childIds];
        }
    }
    return {
        options: queryOptions.join(","),
    };
}

function unserializeOptions(value) {
    const options = Object.keys(value)
        .filter((x) => x.includes("opt-"))
        .map((key) => {
            const newKey = key.replace("opt-", "");
            return { parent: newKey, child: value[key].split(",") };
        });
    return unGroupBy(options);
}

function groupBy(xs, f) {
    return xs.reduce(
        (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
        {}
    );
}

function unGroupBy(value) {
    let data = [];
    for (const option of value) {
        for (const child of option.child) {
            data.push({
                parent: option.parent,
                child: child,
            });
        }
    }
    return data;
}

function filteringOptionIds(value) {
    return unserializeOptions(value).flatMap((x) => x.child.toString());
}

function mappingPrice(query) {
    const price = query.price ? query.price.split("-") : null;
    const from = price && price[0] ? price[0] : null;
    const to = price && price[1] ? price[1] : null;
    return { from, to };
}

function mappingOptions(allOptions, query) {
    const filteringIds = query["options"] ? query["options"].split(",") : [];
    return allOptions.map((x) => {
        x.nodes?.map((c) => {
            c.active = !!filteringIds.includes(c.id.toString());
            return c;
        });
        return x;
    });
}

function mappingBrands(origin = {}, query = {}) {
    const filteringIds = query["brands"] ? query["brands"].split(",") : [];
    const nodesFilter = origin.nodes?.map((c) => {
        c.active = !!filteringIds.includes(c.id.toString());
        return c;
    });
    return {
        ...origin,
        nodes: nodesFilter,
    };
}

function mappingCategories(origin = {}, query = {}) {
    const filteringIds = query["categories"] ? query["categories"].split(",") : [];
    const nodesFilter = origin.nodes?.map((c) => {
        c.active = !!filteringIds.includes(c.id.toString());
        return c;
    });
    return {
        ...origin,
        nodes: nodesFilter,
    };
}

function mappingOrigins(origin = {}, query = {}) {
    const filteringIds = query["origins"] ? query["origins"].split(",") : [];
    const nodesFilter = origin.nodes?.map((c) => {
        c.active = !!filteringIds.includes(c.id.toString());
        return c;
    });
    return {
        ...origin,
        nodes: nodesFilter,
    };
}

function serializeOrigins(origin) {
    const childIds = origin.nodes
        ? origin.nodes.filter((c) => c.active).map((x) => x.id)
        : [];

    return {
        origins: childIds.join(","),
    };
}

function serializeBrands(origin) {
    const childIds = origin.nodes
        ? origin.nodes.filter((c) => c.active).map((x) => x.id)
        : [];

    return {
        brands: childIds.join(","),
    };
}

function serializeCategories(origin) {
    const childIds = origin.nodes
        ? origin.nodes.filter((c) => c.active).map((x) => x.id)
        : [];

    return {
        categories: childIds.join(","),
    };
}

export {
    serializeQuery,
    serializeOptions,
    unserializeOptions,
    filteringOptionIds,
    mappingOptions,
    mappingPrice,
    mappingOrigins,
    serializeOrigins,
    mappingBrands,
    serializeBrands,
    serializeCategories,
    mappingCategories
};
