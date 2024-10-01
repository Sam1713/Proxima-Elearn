import { Variants } from 'framer-motion';


export const SlideRight=(delay:number):Variants=>{
    return{
        hidden:{
            opacity:0, 
            x:-100
        },
        visible:{
            opacity:1,
            x:0,
            transition:{
                duration:1,
                delay:delay
            }
        }
    }
}

export const SlideLeft=(delay:number):Variants=>{ 
    return{
        hidden:{
            opacity:0,
            x:-100
        },
        visible:{
            opacity:1,
            x:0,
            transition:{
                duration:1,
                delay:delay
            }
        }
    }
}

export const SlideUp=(delay:number)=>{
    return{
        hidden:{
            opacity:0,
            y:100
        },
        visible:{
            opacity:1,
            y:0,
            transition:{
                duration:0.5,
                delay:delay
            }
        }
    }
}