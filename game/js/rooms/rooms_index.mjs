import { getRoom1Props } from "./data/room1.mjs";

export const getRoomProps = ( roomId ) => {
    const defaultId = 'room1';
    const roomProps = {
        room1: getRoom1Props(),
    }

    if( roomProps.hasOwnProperty( roomId ) ) {
        return roomProps[ roomId ];
    }

    return roomProps[ defaultId ];
}

