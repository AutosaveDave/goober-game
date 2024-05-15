import { newRoomObj } from "../rooms/room.mjs";

export const newStageObj = ( canv, roomsArray ) => {
    const startRoom = newRoomObj( roomsArray[0] );
    const fpsEl = document.getElementById( 'fps-display' );
    return {
        dimensions: [ canv.width, canv.height ],
        room: startRoom, // This prop will hold a roomObj from newRoomObj function
        roomsArray: roomsArray,
        objects: startRoom.objects,
        sprites: startRoom.sprites,
        canv: canv,
        ctx: canv.getContext("2d"),
        frame: false,
        prevDeltaTime: [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
        previousTime: ( new Date() ).getTime() / 1000 - ( 1000 / 60 ),
        currentTime: ( new Date() ).getTime() / 1000,

        loadRoom: function ( roomId ) {
            const newRoom = newRoomObj( roomId );
            this.room = newRoom;
            this.objects = newRoom.objects;
        },

        move: function ( dt ) {
            const objectsCopy = this.objects;
            for( let a = 0; a < objectsCopy.length; a += 1 ) {
                if( objectsCopy[a].hasOwnProperty( 'move' ) ) {
                    this.objects[a].move( dt );
                }
            }
        },
        draw: function () {
            const objectsCopy = this.objects;
            const ctx = this.ctx;
            const dimensions = this.dimensions;
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect( 0, 0, dimensions[0], dimensions[1] ); // clear canvas
            for( let a = 0; a < objectsCopy.length; a += 1 ) {
                if( objectsCopy[a].hasOwnProperty( 'draw' ) ) {
                    this.objects[a].draw( ctx );
                    // ctx.beginPath();
                    // ctx.arc( ...this.objects[a].pos, 6, 0, 2 * Math.PI, false );
                    // ctx.fill();
                }
            }
        },
        step: function ( dt ) {
            this.move( dt );
            this.draw();
            this.getFrame();
        },

        getFrame: function () {
            const prevTime = this.currentTime;
            const currTime = ( new Date() ).getTime() / 1000;
            this.previousTime = prevTime;
            this.currentTime = currTime;
            const pdt = this.prevDeltaTime;
            const deltaTime = currTime - prevTime;
            let sum = deltaTime;
            pdt.forEach( t => {
                sum += t;
            } );
            const avgDt = sum / ( pdt.length + 1 );
            const fps = Math.round( 100 * ( 1 / avgDt ) ) / 100;
            fpsEl.textContent = `${ fps } fps`;
            this.prevDeltaTime.shift();
            this.prevDeltaTime.push( deltaTime );
            this.frame = window.requestAnimationFrame( () => { this.step( deltaTime ); } );
        },

        start: function () {
            for( let a = 0 ; a < this.objects.length ; a += 1 ) {
                if( this.objects[ a ].hasOwnProperty( 'initControls' ) ) {
                    this.objects[ a ].initControls();
                }
            } 
            this.getFrame();
        }
    };
}