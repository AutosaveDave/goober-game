import { getSpriteOrigin, loadSprite } from "../../assets/sprites/spritesIndex.mjs";
import { newObject } from "../newObject.mjs";
import { getRoomProps } from "./rooms_index.mjs";

export const newRoomObj = ( roomId ) => {
    const roomProps = getRoomProps( roomId );

    function getSpriteManifest() {
        let currentSpriteIndex = 0;
        const sprites = {};
        const result = [];
        const roomObjects = roomProps.objects;
        for( let a = 0 ; a < roomObjects.length ; a += 1 ) {
            const spriteEntries = Object.entries( roomObjects[ a ].spriteIds );
            for( let b = 0 ; b < spriteEntries.length ; b += 1 ) {
                const [ category, id ] = spriteEntries[ b ];
                const idIsArray = Array.isArray( id );
                if( idIsArray === false ) { // --------------- If id is not an Array
                    if( sprites.hasOwnProperty( category ) ) {
                        if( sprites[ category ].hasOwnProperty( id ) ) {
                            roomProps.objects[ a ].sprites[ category ] = sprites[ category ][ id ];
                        } else {
                            sprites[ category ][ id ] = currentSpriteIndex;
                            const { loadedSprite, spriteOrigin } = loadSprite( category, id, currentSpriteIndex );
                            result.push( loadedSprite );
                            roomProps.objects[ a ].sprites[ category ] = currentSpriteIndex;
                            roomProps.objects[ a ].spriteOrigins[ category ] = spriteOrigin;
                            currentSpriteIndex += 1;
                        }
                    } else {
                        sprites[ category ] = {};
                        sprites[ category ][ id ] = currentSpriteIndex;
                        const { loadedSprite, spriteOrigin } = loadSprite( category, id, currentSpriteIndex );
                        result.push( loadedSprite );
                        roomProps.objects[ a ].sprites[ category ] = currentSpriteIndex;
                        roomProps.objects[ a ].spriteOrigins[ category ] = spriteOrigin;
                        currentSpriteIndex += 1;
                    }
                } else {    // ------------------------------ If id is an Array
                    id.forEach( ( side, i ) => {
                        if( sprites.hasOwnProperty( category ) ) {
                            if( sprites[ category ].hasOwnProperty( side ) ) {
                                roomProps.objects[ a ].sprites[ category ][ i ] = sprites[ category ][ side ];
                                roomProps.objects[ a ].spriteOrigins[ category ][ i ] = getSpriteOrigin( category, side );
                            } else {
                                sprites[ category ][ side ] = currentSpriteIndex;
                                const { loadedSprite, spriteOrigin } = loadSprite( category, side, currentSpriteIndex );
                                result.push( loadedSprite );
                                roomProps.objects[ a ].sprites[ category ][ i ] = currentSpriteIndex;
                                roomProps.objects[ a ].spriteOrigins[ category ][ i ] = spriteOrigin;
                                currentSpriteIndex += 1;
                            }
                        } else {
                            sprites[ category ] = {};
                            sprites[ category ][ side ] = currentSpriteIndex;
                            const { loadedSprite, spriteOrigin } = loadSprite( category, side, currentSpriteIndex );
                            result.push( loadedSprite );
                            roomProps.objects[ a ].sprites[ category ] = [];
                            roomProps.objects[ a ].spriteOrigins[ category ] = [];
                            roomProps.objects[ a ].sprites[ category ][ i ] = currentSpriteIndex;
                            roomProps.objects[ a ].spriteOrigins[ category ][ i ] = spriteOrigin;
                            currentSpriteIndex += 1;
                        }
                    } );
                    
                }
            }
        }
        return result;
    }

    const spriteManifest = getSpriteManifest();
    return {
        ...roomProps,
        sprites: spriteManifest,

        addObject: function ( objType, ...args ) {
            const oldArray = [ ...this.objects ];
            const newObj = newObject( objType, ...args );
            let objArray = [ ...oldArray, newObj ];
            this.objects = objArray;
        },
        

        move: function ( dt ) {
            this.objects.forEach( obj => {
                if( obj.hasOwnProperty( 'move' ) ) {
                    obj.move( dt );
                }
            } );
        },
        draw: function () {
            this.objects.forEach( obj => {
                if( obj.hasOwnProperty( 'draw' ) ) {
                    obj.draw();
                }
            } );
        },
    }
}