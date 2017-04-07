import "../css/PlainTextControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import {AutoResizableComponent} from "./AutoResizableComponent";

interface IPlainTextControlInputs {
    Text: string;
}

interface IPlainTextControlProps {
    text: string;
}

export class PlainTextControl extends AutoResizableComponent<IPlainTextControlProps, void> {

    public render(): JSX.Element {
        return (
            <div className={"plaintext-control"}>
                <span className="message-text">{this.props.text}</span>
            </div>
        );
    }
}

export function init() {
    let inputs = VSS.getConfiguration().witInputs as IPlainTextControlInputs;
    
    ReactDOM.render(
        <PlainTextControl 
            text={inputs.Text}
        />, $("#ext-container")[0]);
}