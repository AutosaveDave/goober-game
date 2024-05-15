import { fixAngle } from "../../js/helpers/trig.mjs";

export const prSwing = ( oscTimer, oscPeriod, pSwingArg, partIndex ) => {
    const phase = ( partIndex === 0 ? -1 : 1 );
    const osc = phase * 2 * Math.PI * oscTimer / oscPeriod;
    const pos = [0,0];
    pos[0] = pSwingArg[0] * Math.sin( osc );
    pos[1] = -pSwingArg[1] * Math.pow( Math.sin( osc ), 2 );
    const maxAngle = Math.atan2( pSwingArg[0] - pSwingArg[1], pSwingArg[0] );

    const rot = maxAngle * Math.sin( osc );

    return { rot: fixAngle( rot ), pos: pos };
}