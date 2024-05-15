export const fixAngle = ( angle ) => {
    const pi2 = 2 * Math.PI;
    if( angle >= 0 && angle < pi2 ) return angle;
    if( angle < 0 ) {
        let a = angle;
        while( a < 0 ) { a += pi2; }
        return a;
    } else {
        let a = angle;
        while( a > pi2 ) { a -= pi2 }
        return a;
    }
}