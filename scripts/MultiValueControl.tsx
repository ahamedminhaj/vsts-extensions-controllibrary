import "../css/MultiValueControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Multiselect from "ReactWidgets/Multiselect";

import {FieldControl, IFieldControlProps, IFieldControlState} from "VSTS_Extension/Components/WorkItemControls/FieldControl";
import {InputError} from "VSTS_Extension/Components/Common/InputError";

interface IMultiValueControlInputs {
    FieldName: string;
    Values: string;
}

interface IMultiValueControlProps extends IFieldControlProps {
    suggestedValues: string[];
}

export class MultiValueControl extends FieldControl<IMultiValueControlProps, IFieldControlState> {
    public render(): JSX.Element {
        let className = "multivalue-control-container";
        if (this.state.error) {
            className += " invalid-value";
        }

        return (
            <div className={className}>
                <Multiselect 
                    duration={0}
                    data={this.props.suggestedValues}
                    value={this._parseFieldValue()}
                    onChange={(newValues: string[]) => this.onValueChanged((newValues || []).join(";"))}
                    onToggle={(on: boolean) => this._onToggle(on)} />
                    
                { this.state.error && (<InputError error={this.state.error} />) }
            </div>
        )        
    }

    private _parseFieldValue(): string[] {
        let value = this.state.value as string;
        if (value) {
            return value.split(";").map(v => v.trim());
        }
        else {
            return [];
        }
    }

    private _onToggle(on: boolean) {
        if (on) {
            $("#ext-container").height(260);
        }
        else {
            $("#ext-container").css("height", "auto");
        }

        this.resize();
    }
}

export function init() {
    let inputs = FieldControl.getInputs<IMultiValueControlInputs>();
    
    let values = inputs.Values;
    let suggestedValues: string[];
    if (values) {
        suggestedValues = values.split(";").map(v => {
            return v.trim()
        });
    }
    else {
        suggestedValues = [];
    }

    ReactDOM.render(
        <MultiValueControl 
            fieldName={inputs.FieldName} 
            suggestedValues={suggestedValues}
        />, $("#ext-container")[0]);
}