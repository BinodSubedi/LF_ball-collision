const ball = document.querySelector('.ball');

document.body.style.overflow = 'hidden'


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

        //randomizing color for background
        const red = Math.floor(Math.random() * 255);
        const green = Math.floor(Math.random() * 255);
        const blue = Math.floor(Math.random() * 255);

        // console.log(red,green,blue)

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
        element.style.background =  `rgb(${red}, ${green}, ${blue})`

        document.body.appendChild(element);
        this.element = element
        ball_ledger[this.id] = this
    }

}

//x-axis and y-axis based balls

for(let i = 0; i<500; i++){

    // 10 balls demo with variable momentum option


    // if (i < 5) {

    //     const checkball = new Ball({ height: 30, width: 30, x: 100+ i*80, y: 100 + 80 *i, id: i,dy: 13, dx: 10, x_direction: 1, y_direction:1 })
    //     checkball.create()

    // }else{

    //     const checkball = new Ball({ height: 30, width: 30, x: 100+ i*50, y: 100 + 50 *i, id: i,dy: 13, dx: 10, x_direction: 1, y_direction:1 })

    //     checkball.create()


    // }

    // 500 balls stress-test

    if (i < 3) {

        const checkball = new Ball({ height: 15, width: 15, x: 100, y: 100, id: i, dy: 5, dx: 5, x_direction: 1, y_direction: 1 })

        checkball.create()

    }
    else {

        const checkball = new Ball({ height: 8, width: 8, x: 8 + i * 2, y: 8 + 2 * i, id: i, dy: 5, dx: 5, x_direction: 1, y_direction: 1 })
        checkball.create()

    }



}




setInterval(()=>{

    let distance_ledger = {}

    let ballStrikeCombination = {} //For limiting the two pair of balls to only stike once per 1 second

    Object.values(ball_ledger).forEach((v) => {


        // Inserting distance with reference to the starting of the screen [at the left top-most corner]

        if (v.x > 0 && v.y > 0) {

            const distance = Math.floor(Math.sqrt(v.x ** 2 + v.y ** 2))

            distance_ledger[distance] = v.id


            // checking for collison with other elements

            const maxElementDistance = Math.sqrt((v.height/2) ** 2 + (v.width/2) ** 2);

            for(let i = Math.floor(distance-maxElementDistance); i <= Math.floor(distance + maxElementDistance); i++){


                if (ballStrikeCombination[distance_ledger[i]] == v.id){
                    console.log('already striked!!')
                    break;
                }

                // console.log('near enough');

                // console.log(distance_ledger)
                // console.log(i)
                // console.log(distance_ledger[i])
                
                if (distance_ledger[i] !== undefined){

                
                    const collided_ball = ball_ledger[distance_ledger[i]]; 



                    //checking by commenting
                    if ( Math.sqrt((collided_ball.x - v.x)**2 + (collided_ball.y - v.y)**2) < (v.width/2 + collided_ball.width/2)){


                        const x_difference = Math.sqrt(((collided_ball.x - collided_ball.width) - (v.x - v.width)) ** 2)
                        const y_difference = Math.sqrt(((collided_ball.y - collided_ball.height) - (v.y - v.height)) ** 2)




                        // Trying to deal with angle of reflection without having reference point of incedence in the circumference

                        const m1v1x = v.massAreaUnit * v.dx;
                        const m2v2x = collided_ball.massAreaUnit * collided_ball.dx;


                        const m1v1y = v.massAreaUnit * v.dy;
                        const m2v2y = collided_ball.massAreaUnit * collided_ball.dy; 

                        let yMomentumDiff;
                        let y1Big = {'bigger':null};
                        let xMomentumDiff;
                        let x1Big = {'bigger':null};

                        if(m1v1x > m2v2x){
                            xMomentumDiff = m1v1x - m2v2x;                            
                            x1Big['bigger'] = true;

                        }else if (m1v1x < m2v2x){

                            xMomentumDiff = m2v2x - m1v1x
                            x1Big['bigger'] = false;
                        }

                        // console.log(xMomentumDiff)

                        // Similarly checking for y-vector

                        if(m1v1y > m2v2y){
                            yMomentumDiff = m1v1y - m2v2y;
                            y1Big['bigger'] = true;

                        }else if (m2v2y < m1v1y){
                            yMomentumDiff = m2v2y - m1v1y;
                            y1Big['bigger'] = false;
                        }


                        // console.log('ymomentumDiff::', yMomentumDiff);

                        // Using relative changes to determine direction change

                        const collisionRelativeDifference = {x: Math.abs(v.x - collided_ball.x), y: Math.abs(v.y - collided_ball.y)}

                        // Changing dx and dy respectively

                        //For dx first

                        if(x1Big['bigger'] == true){

                            v.dx -= (xMomentumDiff / (2 * v.massAreaUnit));
                            ball_ledger[distance_ledger[i]].dx += (xMomentumDiff / (2 * collided_ball.massAreaUnit));

                            if(collisionRelativeDifference.x > collisionRelativeDifference.y){

                            v.x_direction *= -1;
                            ball_ledger[distance_ledger[i]].x_direction *= -1;

                            }


                            console.log('x1 big')


                        }else if (x1Big['bigger'] === false){

                            v.dx += (xMomentumDiff / (2 * v.massAreaUnit));
                            ball_ledger[distance_ledger[i]].dx -= (xMomentumDiff / (2 * collided_ball.massAreaUnit));

                            if(collisionRelativeDifference.x > collisionRelativeDifference.y){

                            v.x_direction *= -1;
                             ball_ledger[distance_ledger[i]].x_direction *= -1; 

                            }

                            console.log('x1 not big')

                        }


                        //For dy second

                        if(y1Big['bigger'] == true){

                            v.dy -= (yMomentumDiff / (2 * v.massAreaUnit));
                            ball_ledger[distance_ledger[i]].dy += (yMomentumDiff / (2 * collided_ball.massAreaUnit));

                            if(collisionRelativeDifference.y > collisionRelativeDifference.x){

                            ball_ledger[distance_ledger[i]].y_direction *= -1;
                            v.y_direction *= -1;

                            }


                        }else if (y1Big['bigger'] === false){

                            v.dy += (yMomentumDiff / (2 * v.massAreaUnit));
                            ball_ledger[distance_ledger[i]].dy -= (yMomentumDiff / (2 * collided_ball.massAreaUnit));

                            if(collisionRelativeDifference.y > collisionRelativeDifference.x){

                                v.y_direction *= -1;
                                ball_ledger[distance_ledger[i]].y_direction *= -1;

                            }


                        }

                        if (x1Big['bigger'] == null || y1Big['bigger'] == null){

                            if(collisionRelativeDifference.x > collisionRelativeDifference.y){

                            v.x_direction *= -1;
                            ball_ledger[distance_ledger[i]].x_direction *= -1;

                            }else{

                            v.y_direction *= -1;
                            ball_ledger[distance_ledger[i]].y_direction *= -1;


                            }


                        }



                        ballStrikeCombination[distance_ledger[i]] = v.id;



                }
                }


            }


        }


        if (v.x >= (window.innerWidth - (v.width + 50)) || v.x <= (v.width+50)) {

            v.x_direction = v.x_direction * -1;

            if (v.x >= (window.innerWidth) - (v.width + 50)){
                v.x = window.innerWidth - (v.width + 50)
            }else if(v.x <= (v.width+50)){
                v.x = v.width+50
            }

            // v.dx *= -1;
        }

        //for y-axis
        if (v.y >= (window.innerHeight - (v.height + 50)) || v.y <= (v.height+50)) {
            v.y_direction = v.y_direction * -1;

            if (v.y >= (window.innerHeight) - (v.height + 50)) {
                v.y = window.innerHeight - (v.height + 50)
            } else if (v.y <= v.height + 50) {
                v.y = v.height + 50
            }

            // v.dy *= -1
        }




        v.y += v.y_direction * v.dy;
        v.x += v.x_direction * v.dx;


        v.element.style.top = `${v.y}px`
        v.element.style.left = `${v.x}px`



    })

    

},1000/60)



