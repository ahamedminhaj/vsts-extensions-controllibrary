import "../css/PatternControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Fabric } from "OfficeFabric/Fabric";
import { TextField } from 'OfficeFabric/components/TextField';
import { WorkItemFormService, IWorkItemFormService } from "TFS/WorkItemTracking/Services";

import {FieldControl, IFieldControlProps, IFieldControlState} from "VSTS_Extension/Components/WorkItemControls/FieldControl";
import {InputError} from "VSTS_Extension/Components/Common/InputError";

interface IPatternControlInputs {
    FieldName: string;
    Pattern: string;
    ErrorMessage?: string;
}

interface IPatternControlProps extends IFieldControlProps {
    pattern: string;
    errorMessage: string;
}

export class PatternControl extends FieldControl<IPatternControlProps, IFieldControlState> {
    private _service: IWorkItemFormService;

    public render(): JSX.Element {
        let className = "pattern-control-input";
        if (this.state.error) {
            className += " invalid-value";
        }
          
        return (
            <Fabric className="fabric-container">
                <TextField 
                    className="pattern-control"
                    inputClassName={className} 
                    value={this.state.value} 
                    onChanged={(newValue: string) => this.onValueChanged(newValue)} />
                    
                { this.state.error && (<InputError error={this.state.error} />) }
            </Fabric>
        )        
    }    

    protected getErrorMessage(value: string): string {
        if (value) {
            var patt = new RegExp(this.props.pattern);
            return patt.test(value) ? "" : this.props.errorMessage;
        }

        return "";
    }
}

export function init() {
    let inputs = FieldControl.getInputs<IPatternControlInputs>();
    
    ReactDOM.render(
        <PatternControl 
            fieldName={inputs.FieldName} 
            pattern={inputs.Pattern}
            errorMessage={inputs.ErrorMessage && inputs.ErrorMessage.trim() || "The entered value does not match the control's pattern."}
        />, $("#ext-container")[0]);
}