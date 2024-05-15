export const pvOsc = ( oscTimer, oscPeriod, arg, partIndex ) => {
    const osc = 4 * Math.PI * ( 1 - oscTimer / oscPeriod );
    const pos = [0,0];
    pos[1] = arg * Math.cos( osc );
    return { pos: pos };
}