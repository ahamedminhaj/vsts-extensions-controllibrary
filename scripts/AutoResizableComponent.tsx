import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Utils_Core from "VSS/Utils/Core";

export class AutoResizableComponent<TP, TS> extends React.Component<TP, TS> {
    private _windowWidth: number;
    private _minWindowWidthDelta: number = 10; // Minum change in window width to react to
    private _windowResizeThrottleDelegate: Function;

    constructor(props: TP, context?: any) {
        super(props, context);

        this._windowResizeThrottleDelegate = Utils_Core.throttledDelegate(this, 50, () => {
            this._windowWidth = window.innerWidth;
            this.resize();
        });

        this._windowWidth = window.innerWidth;
        $(window).resize(() => {
            if(Math.abs(this._windowWidth - window.innerWidth) > this._minWindowWidthDelta) {
               this._windowResizeThrottleDelegate.call(this);
            }
        });
    }

    public render(): JSX.Element {
        return null;
    }

    public componentDidMount() {
        this.resize();
    }

    public componentDidUpdate() {
        this.resize();
    }

    protected resize(delay?: number) {
        const f = () => {
            let bodyElement = document.getElementsByTagName("body").item(0) as HTMLBodyElement;            
            (VSS as any).resize(null, bodyElement.offsetHeight);  
        }
        const throttle = Utils_Core.throttledDelegate(this, delay, f);

        if (delay) {
            throttle();
        }
        else {
            f();
        }
    }
}