import { newStageObj } from "./game/js/stage/stage.mjs";

const canvas = window.document.getElementById('game-canvas');

let mouseCoords = [ 0, 0 ];

export const getMouseCoords = () => mouseCoords;

export const getCanvasDimensions = () => {
    return [ canvas.width, canvas.height ];
}

const roomsArray = [ 'room1' ];
const stage = newStageObj( canvas, roomsArray );

export const getSpriteFromIndex = ( index ) => {
    return stage.sprites[ index ];
};

const mouseMoveEvent = document.addEventListener( 'mousemove', ( e ) => {
    const { left, top } = canvas.getBoundingClientRect();
    mouseCoords = [ e.clientX - left, e.clientY - top ];
} )

stage.start();