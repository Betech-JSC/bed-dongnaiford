"use strict";

let tags = ["h2"];

function extractHtml(html) {
    let newHtml = html;
    let headings = [];
    tags.forEach(function (tag) {
        const regexp = findTag(tag);
        const matches = html ? html.matchAll(regexp) : [];

        for (const match of matches) {
            let content = stripTag(match[1]);

            let slug = generateSlug(content);
            let oldHeadingHtml = match[0];
            let newHeadingHtml = oldHeadingHtml.replace(
                `<${tag}`,
                `<${tag} id="${slug}"`
            );
            newHtml = newHtml.replace(oldHeadingHtml, newHeadingHtml);

            const heading = {
                tag: tag,
                content: content,
                slug: slug,
                index: html.indexOf(oldHeadingHtml),
                children: [],
            };

            headings.push(heading);
        }
    });
    headings = toNested(headings);
    const toc = headings;
    return { html: newHtml, toc: headings };
}

function toNested(allHeading) {
    allHeading = sortByIndex(allHeading).reverse();

    const reverseTags = tags.reverse();

    reverseTags.forEach(function (tag, index) {
        const parentTag = reverseTags[index + 1];
        let childHeadings = sortByIndex(
            allHeading.filter((x) => x.tag === tag)
        );
        let parentHeadings = allHeading.filter((x) => x.tag === parentTag);

        for (const heading of childHeadings) {
            let parent = parentHeadings.find(
                (x, index) => x.index < heading.index
            );
            if (parent) {
                const parentIndex = allHeading.indexOf(parent);
                allHeading[parentIndex].children.push(heading);

                const headingIndex = allHeading.indexOf(heading);
                allHeading.splice(headingIndex, 1);
            }
        }
    });

    return sortByIndex(allHeading);
}

function sortByIndex(tags) {
    return tags.sort((a, b) => a.index - b.index);
}

function findTag(tag) {
    return `<${tag}[^>]*>(.*?)<\/${tag}>`;
}

function stripTag(html) {
    return html.replace(/<[^>]*>?/gm, "");
}

function generateSlug(str, separator = "-") {
    if (!str) return str;
    return str
        .toLowerCase()
        .replace(/\t/g, "")
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, separator)
        .replace(/[^A-Za-z0-9_-]/g, "")
        .replace(/-+/g, separator);
}

function useTransformContent(html, listTag = null) {
    tags = listTag ? listTag : tags;
    return extractHtml(html);
}

export { useTransformContent };
