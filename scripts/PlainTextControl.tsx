import "../css/PlainTextControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import {Label} from "OfficeFabric/Label";

import {AutoResizableComponent} from "VSTS_Extension/Components/WorkItemControls/AutoResizableComponent";

interface IPlainTextControlInputs {
    Text: string;
}

interface IPlainTextControlProps {
    text: string;
}

export class PlainTextControl extends AutoResizableComponent<IPlainTextControlProps, {}> {

    public render(): JSX.Element {
        return (
            <Label className={"plaintext-control"}>{this.props.text}</Label>
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