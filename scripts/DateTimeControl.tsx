import "../css/DateTimeControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Moment from "moment";
import * as DateTimePicker from "ReactWidgets/DateTimePicker";
import * as MomentLocalizer from "ReactWidgets/localizers/moment";

import {BaseFieldControl, IBaseFieldControlProps, IBaseFieldControlState} from "./BaseFieldControl";
import {InputError} from "./InputError";

interface IDateTimeControlInputs {
    FieldName: string;
}

export class DateTimeControl extends BaseFieldControl<IBaseFieldControlProps, IBaseFieldControlState> {

    public render(): JSX.Element {
        let className = "datetime-control-container";
        if (this.state.error) {
            className += " invalid-value";
        }

        return (
            <div className={className}>
                <DateTimePicker 
                    duration={0}
                    value={this.state.value} 
                    onChange={(newDate: Date, dateStr: string) => this.onValueChanged(newDate)} 
                    onToggle={(on: any) => this._onToggle(on)} />
                    
                { this.state.error && (<InputError error={this.state.error} />) }
            </div>
        )        
    }

    private _onToggle(on: any) {
        if (on === "calendar") {
            $("#ext-container").height(470);
        }
        else if (on === "time") {
            $("#ext-container").height(270);
        }
        else {
            $("#ext-container").css("height", "auto");
        }

        this.resize();
    }
}

export function init() {
    MomentLocalizer(Moment);
    let inputs = BaseFieldControl.getInputs<IDateTimeControlInputs>();

    ReactDOM.render(
        <DateTimeControl 
            fieldName={inputs.FieldName}
        />, $("#ext-container")[0]);
}