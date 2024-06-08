const ball = document.querySelector('.ball');

document.body.style.overflow = 'hidden'
// document.body.style.padding = '5rem'
// document.body.style.padding = '8rem'


let ball_ledger = {}

// let distance_ledger = {}

class Ball{
    constructor({height,width, x, y, id,dx,dy, x_direction, y_direction}){
        this.id = id; // id for knowing the specific ball from thousands
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        // this.x_direction = x_direction
        // this.y_direction = y_direction
        this.dx = dx
        this.dy = dy
        this.massAreaUnit = this.height * this.width * 0.3
        this.slope = this.dy / this.dx
        this.x_direction = x_direction
        this.y_direction = y_direction
    } 


    create(){
        const element = document.createElement('div');

        element.style.height = `${this.height}px`
        element.style.width = `${this.width}px`
        element.style.left = `calc(${this.x - this.width / 2}px)`
        element.style.top = `calc(${this.y - this.height / 2}px)`
        element.style.backgroundColor = 'cyan'
        element.style.position = 'absolute'
        // element.style.zIndex = 1;
        // element.style.margin = '0.3rem'
        element.style.borderRadius = '50%'

        document.body.appendChild(element);
        this.element = element
        ball_ledger[this.id] = this
    }

}

//x-axis and y-axis based balls
for(let i = 0; i<10; i++){

    if (i < 9) {

        const checkball = new Ball({ height: 80, width: 80, x: 100+ i*80, y: 100 + 80 *i, id: i,dy: 13, dx: 10, x_direction: 1, y_direction:1 })
        checkball.create()

    }else{

        const checkball = new Ball({ height: 80, width: 80, x: 100+ i*50, y: 100 + 50 *i, id: i,dy: 13, dx: 10, x_direction: 1, y_direction:1 })

        checkball.create()



    }

}


// y-axis based balls
// for(let i = 0; i<10; i++){

//     // const checkball = new Ball({height:10, width: 10, x:10+ i, y:10+i, id:i,y_direction:1,y_velocity:1.5})
//     // checkball.create()

// }


setInterval(()=>{

    let distance_ledger = {}

    Object.values(ball_ledger).forEach((v) => {

        //for x-axis
        if(v.x >= (window.innerWidth - 50) || v.x <= 50){

            v.x_direction = v.x_direction * -1;

            // v.dx *= -1;
        }

        //for y-axis
        if (v.y >= (window.innerHeight - 80) || v.y <= 80) {
            v.y_direction = v.y_direction * -1;

            // v.dy *= -1
        }

        // v.y += v.y_direction * v.dy;
        // v.x += v.x_direction * v.dx;

        // Inserting distance with reference to the starting of the screen [at the left top-most corner]

        if (v.x > 0 && v.y > 0) {

            const distance = Math.floor(Math.sqrt(v.x ** 2 + v.y ** 2))

            distance_ledger[distance] = v.id

            // checking for collison with other elements

            const maxElementDistance = Math.sqrt((v.height) ** 2 + (v.width) ** 2);

            const positive_offset = (distance + maxElementDistance) > 100 ? 100 : Math.floor(distance + maxElementDistance);
            const negative_offset = (distance - maxElementDistance) < 0 ? 0 : Math.floor(distance - maxElementDistance);

            // console.log(positive_offset)
            // console.log(negative_offset)

            for(let i = Math.min(negative_offset, positive_offset); i <= Math.max(negative_offset,positive_offset); i++){

                // console.log('collision')

                // console.log('negative_offset::', negative_offset)
                // console.log('positive_offset::', positive_offset)

                if (distance_ledger[i] !== undefined){

                    // console.log('collision')
                
                    const collided_ball = ball_ledger[distance_ledger[i]]; 

                    // console.log('maxElementDistance',maxElementDistance)
                    // console.log('distance',Math.sqrt((collided_ball.x - v.x)**2 + (collided_ball.y - v.y)**2))

                    // console.log('collided_ball',collided_ball.x)
                    // console.log('v.x::',v.x)

                    //checking by commenting
                    if ( Math.sqrt((collided_ball.x - v.x)**2 + (collided_ball.y - v.y)**2) <= maxElementDistance + 10){
                    //    if(Math.abs(collided_ball.x - v.x) <= v.width && Math.abs(collided_ball.y - v.y) <= v.height){

                        console.log('collision')

                        const x_difference = Math.sqrt(((collided_ball.x - collided_ball.width) -(v.x - v.width))**2)
                        const y_difference = Math.sqrt(((collided_ball.y - collided_ball.height) - (v.y - v.height))**2)

                        // if(x_difference < y_difference){



                        //     // v.x_direction *= -1;
                        //     // ball_ledger[distance_ledger[i]].x_direction *= -1

                        //     console.log('x-hit')

                        // } else {

                        //     // v.y_direction *= -1;
                        //     // ball_ledger[distance_ledger[i]].y_direction *= -1
                        //     console.log('y-hit')

                        // }




                        // Trying to deal with angle of reflection without having reference point of incedence in the circumference

                        const m1v1x = v.massAreaUnit * v.dx;
                        const m2v2x = collided_ball.massAreaUnit * collided_ball.dx;


                        const m1v1y = v.massAreaUnit * v.dy;
                        const m2v2y = collided_ball.massAreaUnit * collided_ball.dy; 

                        let yMomentumDiff;
                        let y1Big = true;
                        let xMomentumDiff;
                        let x1Big = true;

                        if(m1v1x > m2v2x){

                            xMomentumDiff = m1v1x - m2v2x;                            

                        }else{
                            xMomentumDiff = m2v2x - m1v1x
                            x1Big = false;
                        }

                        console.log(xMomentumDiff)

                        // Similarly checking for y-vector

                        if(m1v1y > m2v2y){
                            yMomentumDiff = m1v1y - m2v2y;
                        }else{
                            yMomentumDiff = m2v2y - m1v1y;
                            y1Big = false;
                        }


                        // console.log('ymomentumDiff::', yMomentumDiff);

                        // Changing dx and dy respectively

                        //For dx first

                        if(x1Big){

                            v.dx -= (xMomentumDiff / (2 * v.massAreaUnit));
                            // ball_ledger[distance_ledger[i]].dx += (xMomentumDiff / (2 * collided_ball.massAreaUnit));
                            // ball_ledger[distance_ledger[i]].x_direction *= -1;


                        }else if (!x1Big){

                            v.dx += (xMomentumDiff / (2 * v.massAreaUnit));
                            // ball_ledger[distance_ledger[i]].dx -= (xMomentumDiff / (2 * collided_ball.massAreaUnit));
                            v.x_direction *= -1;

                        }


                        //For dy second

                        if(y1Big){

                            v.dy -= (yMomentumDiff / (2 * v.massAreaUnit));
                            // ball_ledger[distance_ledger[i]].dy += (yMomentumDiff / (2 * collided_ball.massAreaUnit));
                            // ball_ledger[distance_ledger[i]].y_direction *= -1;

                        }else if (!y1Big){

                            v.dy += (yMomentumDiff / (2 * v.massAreaUnit));
                            // ball_ledger[distance_ledger[i]].dy -= (yMomentumDiff / (2 * collided_ball.massAreaUnit));
                            v.y_direction *= -1;

                        }

                        if(xMomentumDiff == 0){
                            v.x_direction *= -1;
                            // ball_ledger[distance_ledger[i]].x_direction *= -1;
                        }
                        // else if(yMomentumDiff == 0){
                        //     v.y_direction *= -1;
                        //     ball_ledger[distance_ledger[i]].y_direction *= -1;
                        // }

                    // if(v.x_velocity == collided_ball.x_velocity){

                        // v.x_direction = v.x_direction * -1;
                        // collided_ball.x_direction *= -1;

                    // }else if(v.y_velocity == collided_ball.y_direction){
                        
                        // v.y_direction *= -1;
                        // collided_ball.y_direction *= -1;
                        
                    // }else if(v.y_velocity == collided_ball.x_velocity || v.x_velocity == collided_ball.y_velocity){

                        // if(v.x_direction != undefined){
                        //     collided_ball.x_direction = v.x_direction;
                        //     v.x_direction *= -1;
                        //     v.y_direction = collided_ball.y_direction;
                        //     collided_ball.y_direction *= -1;

                        // }

                    // }



                        // console.log('checking v.dy here too...',v.dy)



                }
                }

                // console.log(i)

            }


        }


        // console.log('v.x,v.x_direction,v.dx,v.dy', v.x, v.x_direction, v.dx, v.dy);

        v.y += v.y_direction * v.dy;
        v.x += v.x_direction * v.dx;

        // v.y += v.dy;
        // v.x += v.dx;




        v.element.style.top = `${v.y}px`
        v.element.style.left = `${v.x}px`



    })

    // console.log(Object.keys(distance_ledger).length)

    

},1000/60)



