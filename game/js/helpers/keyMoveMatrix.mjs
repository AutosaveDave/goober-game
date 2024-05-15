const diagonal = Math.sqrt( 0.5 );

const theMatrix = [
    // Each of these is a column
    [ [ -diagonal, -diagonal ], [ -1, 0 ], [ -diagonal, diagonal ] ],
    [ [ 0, -1 ], [ 0, 0 ], [ 0, 1 ] ],
    [ [ diagonal, -diagonal ], [ 1, 0 ], [ diagonal, diagonal ] ],
];

export const keyMoveMatrix = ( [ x, y ] ) => {
    return theMatrix[ 1 + x ][ 1 + y ];
}