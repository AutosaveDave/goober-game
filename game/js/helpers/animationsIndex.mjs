import { prSwing } from "../../assets/animations/prSwing.mjs"
import { pvOsc } from "../../assets/animations/pvOsc.mjs";
import { relax } from "../../assets/animations/relax.mjs";

const animations = {
    prSwing: prSwing,
    pvOsc: pvOsc,
}

export const getAnimationCoords = ( animName, ...args ) => {
    if( animations.hasOwnProperty( animName ) ) {
        const animFunction = animations[ animName ];
        return animFunction( ...args )
    }
    return false;
}