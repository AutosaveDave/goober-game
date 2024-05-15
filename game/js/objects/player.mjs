import { getCanvasDimensions, getMouseCoords, getSpriteFromIndex } from "../../../script.mjs";
import { getAnimationCoords } from "../helpers/animationsIndex.mjs";
import { keyMoveMatrix } from "../helpers/keyMoveMatrix.mjs";
import { pointDirection } from "../helpers/pointDirection.mjs";
import { fixAngle } from "../helpers/trig.mjs";

const playerColors = ['#FF0000', '#00FF00', '#FFFF00', '#00FFFF']

export const newPlayerObj = ( [ x, y ], playerIndex ) => {

    const selfCanv = document.createElement( 'canvas' );

    const selfCanv2 = document.body.appendChild( selfCanv );
    const selfCanvId = `player-${ playerIndex }-self-canvas`;
    selfCanv2.id = selfCanvId;
    selfCanv2.hidden = true;


    const selfCanvEl = document.getElementById( selfCanvId );
    selfCanvEl.width = 256;
    selfCanvEl.height = 256;
    selfCanvEl.style.width = 256;
    selfCanvEl.style.height = 256;

    const selfCtx = selfCanvEl.getContext( "2d" );
    const mCoords = getMouseCoords();

    return {
        index: playerIndex,
        pos: [ x, y ],
        color: playerColors[ playerIndex % 4 ],
        velocity: [ 0, 0 ],
        moveSpeed: 200, // 200 px/second
        canvasDimensions: getCanvasDimensions(),
        controls: {
            keyboard: {
                w: [ 0, -1 ],
                a: [ -1, 0 ],
                s: [ 0, 1 ],
                d: [ 1, 0 ],
            },
            mouse: {

            },
            controller: {

            },
        },
        keydownEvent: false,
        keyupEvent: false,
        keyMoveVectors: [],
        spriteIds: {
            body: 'froggy',
            hand: [ 'hand1', 'hand1' ], // [ LEFT, RIGHT ]
            foot: [ 'foot1', 'foot1' ], // [ LEFT, RIGHT ]
        },
        spriteBaseCoords: {
            body: [ 128, 128 ],
            hand: [ [ 124, 160 ], [ 132, 160 ] ],
            foot: [ [ 132, 192 ], [ 124, 192 ] ],
        },
        spriteCoords: {
            body: [ 0, 0 ],
            hand: [ [ 0, 0 ], [ 0, 0 ] ],
            foot: [ [ 0, 0 ], [ 0, 0 ] ],
        },
        partBaseRots: {
            body: 0,
            hand: [ 0, 0 ],
            foot: [ 0, 0 ]
        },
        partRots: {
            body: 0,
            hand: [ 0, 0 ],
            foot: [ 0, 0 ]
        },
        spriteOrigins: {},
        sprites: {},
        selfCanv: selfCanvEl,
        selfCanvDim: [ selfCanvEl.width, selfCanvEl.height ],
        selfCtx: selfCtx,
        drawOrder: [
            // --------------   Facing Left:    drawOrder[0]
            [ [ 'hand', 1 ], [ 'foot', 1 ], 'body', [ 'foot', 0 ], [ 'hand', 0 ] ], 
            // --------------   Facing Right:   drawOrder[1]
            [ [ 'hand', 0 ], [ 'foot', 0 ], 'body', [ 'foot', 1 ], [ 'hand', 1 ] ], 
        ],
        facing: 1, // Left: 0, Right: 1 
        mouseCoords: mCoords,
        mouseDir: 0,
        walkTimer: 0,
        walkPeriod: 144,
        standTimer: 0,
        standPeriod: 144,
        animation: {
            relax: 220,

            body: { 
                walk: { 
                    pvOsc: 8,
                },
                stand: {
                    pvOsc: 12,
                }
            },
            hand: {
                walk: {
                    prSwing: [ 48, 24 ],
                },
                stand: {
                    pvOsc: 6,
                }
            },
            foot: { 
                walk: {
                    prSwing: [ 48, 18 ],
                },
            },
        },

        updateWalkTimer: function ( dt ) {
            const wt = this.walkTimer;
            const wp = this.walkPeriod;
            const f = this.facing;
            const [ vx, vy ] = this.velocity;
            const v = Math.sqrt( Math.pow( vx, 2 ) + Math.pow( vy, 2 ) );
            let wtAdd = ( ( ( f === 1 && vx >= 0 ) || ( f === 0 && vx <=0 ) ) ? v * dt : -v * dt );
            if( v === 0 ) {
                if( wt === 0 ) {
                    const sTimer = this.standTimer + 36 * dt;
                    this.standTimer  = sTimer;
                } else {
                    const d = ( wt < wp / 2 ? -1 : 1 );
                    wtAdd = d * this.animation.relax * dt;
                    if( d === -1 && wtAdd > wt ) wtAdd = -wt;
                    if( d === 1 && wtAdd + wt > wp ) wtAdd = wp - wt;
                }
                
            } else {
                this.standTimer = 0;
            }
            let result = wt + wtAdd;
            while( result < 0 ) result += wp;
            while( result >= wp ) result -= wp;

            this.walkTimer = result;
        },

        initControls: function () {
            const { keyboard, mouse, controller } = this.controls;
            this.keydownEvent = document.addEventListener( 'keydown', ( event ) => {
                const key = event.key.toLowerCase();
                const keyVec = keyboard[ key ];
                if( !this.keyMoveVectors.includes( keyVec ) && [ 'w','a','s','d' ].includes( key ) ) {
                    this.keyMoveVectors.push( keyVec );
                }
            } );
            this.keyupEvent = document.addEventListener( 'keyup', ( event ) => {
                const key = event.key.toLowerCase();
                const keyVec = keyboard[ key ];
                for( let a = 0 ; a < this.keyMoveVectors.length ; a += 1 ) {
                    if( this.keyMoveVectors[ a ] === keyVec ) {
                        this.keyMoveVectors.splice( a, 1 );
                    }
                }
            } );
        },

        getKeyVec: function () {
            let keyVec = [ 0, 0 ];
            if( this.keyMoveVectors.length > 0 ) {
                for( let a = 0 ; a < this.keyMoveVectors.length ; a += 1 ) {
                    keyVec[0] += this.keyMoveVectors[ a ][ 0 ];
                    keyVec[1] += this.keyMoveVectors[ a ][ 1 ];
                }
            }
            return keyMoveMatrix( keyVec );
        },

        getAnimTimer: function ( act ) {
            switch( act ) {
                case 'walk':    return [ this.walkTimer, this.walkPeriod ];
                case 'stand':   return [ this.standTimer, this.standePeriod ];
                default: return [ this.walkTimer, this.walkPeriod ];
            }
        },

        animStatusCheck: function ( status ) {
            switch( status ) {
                case 'walk': return ( 
                    !( this.velocity[0] === 0 && this.velocity[1] === 0 ) 
                    || !( this.walkTimer === 0 ) 
                );
                case 'stand': return ( 
                    this.velocity[0] === 0 && this.velocity[1] === 0 
                    && this.walkTimer === 0
                );
                default: return false;
            }
        },

        animatePart: function( part, sideIndex ) {
            if( this.animation.hasOwnProperty( part ) ){
                const animArray = Object.entries( this.animation[ part ] );
                animArray.forEach( ( [ key, val ] ) => {
                    let animPlaying = false;
                    if( this.animStatusCheck( key ) ) {
                        const actArray = Object.entries( val );
                        actArray.forEach( ( [ act, animArgs ] ) => {
                            animPlaying = true;
                            const [ mt, mp ] = this.getAnimTimer( act );
                            const { rot, pos } = getAnimationCoords( 
                                act, mt, mp, 
                                animArgs, sideIndex 
                            );
                            if( rot ) {
                                if( sideIndex === -1 ) {
                                    this.partRots[ part ] = fixAngle( rot + this.partBaseRots[ part ] );
                                } else {
                                    this.partRots[ part ][ sideIndex ] = fixAngle( rot + this.partBaseRots[ part ][ sideIndex ] );
                                }
                            }
                            if( pos ) {
                                if( sideIndex === -1 ) {
                                    this.spriteCoords[ part ][0] = pos[0];
                                    this.spriteCoords[ part ][1] = pos[1];
                                } else {
                                    this.spriteCoords[ part ][ sideIndex ][0] = pos[0];
                                    this.spriteCoords[ part ][ sideIndex ][1] = pos[1];
                                }
                            }
                            // if( part === 'foot' && sideIndex === 1 )
                            //     console.log( this.partRots[ part ][ sideIndex ] )
                        } );
                    }
                    // if( !animPlaying ) {

                    // }
                } );
            }
        },

        animateParts: function ( dt ) {     // --------------------------   ANIMATE
            this.updateWalkTimer( dt );
            this.partRots.body = this.mouseDir;
            const parts = Object.keys( this.spriteCoords );
            parts.forEach( part => {
                if( Array.isArray( this.partRots[ part ] ) ) {
                    this.animatePart( part, 0 );
                    this.animatePart( part, 1 );
                } else {
                    this.animatePart( part, -1 );
                }
                
            } );
        },

        move: function ( dt ) {             // --------------------------   MOVE
            const mc = getMouseCoords();
            this.mouseCoords = mc;
            const md = pointDirection( this.pos, mc );
            this.mouseDir = md;
            const fd = ( ( md > Math.PI / 2 && md <= 3 * Math.PI / 2 ) ? 0 : 1 );
            this.facing = fd;
            const keyVec = this.getKeyVec();
            if( keyVec[0] === 0 && keyVec[1] === 0 ) {
                this.velocity = [ 0, 0 ];
            }
            this.velocity[0] = keyVec[0] * this.moveSpeed;
            this.velocity[1] = keyVec[1] * this.moveSpeed;

            this.pos[0] += this.velocity[0] * dt;
            if( this.pos[0] < 0 ) { this.pos[0] = 0; }
            if( this.pos[0] > this.canvasDimensions[0] ) { this.pos[0] = this.canvasDimensions[0]; }
            this.pos[1] += this.velocity[1] * dt;
            if( this.pos[1] < 0 ) { this.pos[1] = 0; }
            if( this.pos[1] > this.canvasDimensions[1] ) { this.pos[1] = this.canvasDimensions[1]; }
            this.animateParts( dt )
        },
        clearSelfCanvas: function () {
            const ctx = this.selfCtx;
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect( 0, 0, ...this.selfCanvDim ); // clear canvas
        },

        getPartBaseCoords: function ( part, sideIndex ) {
            return ( sideIndex === -1 
                ? this.spriteBaseCoords[ part ] 
                : this.spriteBaseCoords[ part ][ sideIndex ]
            );
        },
        getPartCoords: function ( part, sideIndex ) {
            return ( sideIndex === -1 
                ? this.spriteCoords[ part ] 
                : this.spriteCoords[ part ][ sideIndex ]
            );
        },
        getPartSprite: function ( part, sideIndex ) {
            return ( sideIndex === -1
                ? getSpriteFromIndex( this.sprites[ part ] )
                : getSpriteFromIndex( this.sprites[ part ][ sideIndex ] )
            );
        },
        getPartOrigin: function ( part, sideIndex ) {
            return ( sideIndex === -1 
                ? this.spriteOrigins[ part ] 
                : this.spriteOrigins[ part ][ sideIndex ] 
            );
        },
        getXscale: function () {
            return ( this.facing === 0 ? -1 : 1 );
        },

        drawPart: function ( part, sideIndex ) {
            const sctx = this.selfCtx;
            const xscale = this.getXscale();
            const partSprite = this.getPartSprite( part, sideIndex );
            const origin = this.getPartOrigin( part, sideIndex );
            const baseCoords = this.getPartBaseCoords( part, sideIndex );
            const offsetCoords = this.getPartCoords( part, sideIndex );
            const sdim = [ partSprite.width, partSprite.height ]; //sprite dimensions
            const drawCoords = [ 0, 0 ];

            for( let a = 0 ; a < 2 ; a += 1 ) {
                drawCoords[a] = baseCoords[a] + offsetCoords[a];
            }
            const rotAdd = ( ( xscale === -1 && sideIndex === -1 ) ? Math.PI : 0 );
            const rot = ( sideIndex === -1 
                ? fixAngle( this.partRots[ part ] + rotAdd )
                : fixAngle( this.partRots[ part ][ sideIndex ] + rotAdd )
            );
            const imgCoords = [ 
                ( xscale === -1 
                    ? sdim[0]-origin[0]
                    : -origin[0]
                ), 
                -origin[1] 
            ];

            sctx.translate( ...drawCoords );
            sctx.rotate( -rot );
            sctx.scale( xscale, 1 );

            sctx.drawImage( partSprite, ...imgCoords, xscale * sdim[0], sdim[1] );

            sctx.scale( xscale, 1 );
            sctx.rotate( rot );
            sctx.translate( -drawCoords[0], -drawCoords[1] );
        },
        drawParts: function () {
            this.clearSelfCanvas();
            this.drawOrder[ this.facing ].forEach( partArg => {
                const argIsArray = Array.isArray( partArg );
                const part = ( argIsArray ? partArg[0] : partArg );
                const sideIndex = ( argIsArray ? partArg[1] : -1 );
                this.drawPart( part, sideIndex );
            } );
        },
        draw: function ( ctx ) {
            this.drawParts();
            
            ctx.drawImage( this.selfCanv, this.pos[0] - Math.floor(this.selfCanvDim[0]/2), this.pos[1] - Math.floor(this.selfCanvDim[1]/2) ); 
        },
    }
}