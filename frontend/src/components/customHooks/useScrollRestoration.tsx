import { useEffect } from "react";

const useScrollRestoration=()=>{
    useEffect(()=>{
        window.scrollTo(0,0)
    },[])
}
export default useScrollRestoration;
