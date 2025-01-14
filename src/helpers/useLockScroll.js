import { useEffect } from "react"


export const useLockScroll = (condition) => {

    useEffect(() => {
      
        if(condition){
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }



    }, [condition])
    

}
