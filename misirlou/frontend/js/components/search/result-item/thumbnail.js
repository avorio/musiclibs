import React from 'react';

import { getImageUrlWithMaxWidth } from '../../../utils/iiif-manifest-accessors';

import { thumbnailType } from './types';
import './search-result-item.css!';


const MAX_THUMBNAIL_WIDTH = 100;


export default function Thumbnail({ src })
{
    let imgSrc;

    if (typeof src === 'string')
    {
        imgSrc = src;
    }
    else if (src)
    {
        const resolved = getImageUrlWithMaxWidth(src, MAX_THUMBNAIL_WIDTH);

        if (resolved)
            imgSrc = resolved.url;
    }

    return (
        <div className="search-result__item__thumbnail">
            {imgSrc && <img src={imgSrc} />}
        </div>
    );
}

Thumbnail.propTypes = {
    src: thumbnailType.isRequired
};

export const __hotReload = true;