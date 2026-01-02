import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useMobile() {
    const [mobile, setMobile] = React.useState<boolean | undefined>(
        undefined
    );

    React.useEffect(() => {
        const onChange = () => {
            setMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        mql.addEventListener("change", onChange);
       
        setMobile(window.innerWidth < MOBILE_BREAKPOINT);
       
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return !!mobile;
}
