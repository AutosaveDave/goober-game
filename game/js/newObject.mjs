import { newPlayerObj } from "./objects/player.mjs";

export const newObject = ( objectType, ...args ) => {
    switch( objectType ) {
        case 'player': case 'p':
            return newPlayerObj( ...args );
            break;
    }
}