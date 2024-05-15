// Returns direction from point1 to point2 in radians
export const pointDirection = ( [ x1, y1 ], [ x2, y2 ] ) => {
    const dir = Math.atan2( -(y2 - y1), x2 - x1 );
    return ( dir + 2 * Math.PI ) % ( 2 * Math.PI );
}