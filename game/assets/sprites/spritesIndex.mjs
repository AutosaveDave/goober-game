import { bodySprites } from "./body/_index.mjs";
import { footSprites } from "./foot/_index.mjs";
import { handSprites } from "./hand/_index.mjs";

const getNameAndOrigin = ( cat, id ) => {
    switch( cat ) {
        case 'body':
            if( bodySprites.hasOwnProperty( id ) ) {
                return { 
                    filename: bodySprites[ id ].filename,
                    origin: bodySprites[ id ].origin
                };
            }
            return false;
        case 'hand':
            if( handSprites.hasOwnProperty( id ) ) {
                return {
                    filename: handSprites[ id ].filename,
                    origin: handSprites[ id ].origin
                };
            }
            return false;
        case 'foot':
            if( footSprites.hasOwnProperty( id ) ) {
                return {
                    filename: footSprites[ id ].filename,
                    origin: footSprites[ id ].origin
                };
            }
            return false;
        default:
            return false;
    }
}

export const loadSprite = ( category, spriteId, index ) => {
    
    const image = document.createElement( 'img' );
    const { filename, origin } = getNameAndOrigin( category, spriteId );

    image.src = `game/assets/sprites/${ category }/${ filename }`;
    image.style.offsetPosition = `${ origin[0] }px`;
    const idString = `sprite-${ index }`;

    const imageEl = document.body.appendChild( image );
    imageEl.id = idString;
    imageEl.hidden = true;

    const img1 = document.getElementById( idString );

    const result = {
        loadedSprite: img1,
        spriteOrigin: origin
    }

    return result;
};

export const getSpriteOrigin = ( category, spriteId ) => {
    const { origin } = getNameAndOrigin( category, spriteId );
    return origin;
};