import { newObject } from "../../newObject.mjs";

export const getRoom1Props = () => {
    const objectsArray = [
        newObject( 'player', [400,300], 0 ),
    ];
    return {
        id: "room1",
        dimensions: [ 800, 600 ],
        bgcolor: "#77CCFF",
        timeSpeed: 1,
        objects: objectsArray,
    }
}