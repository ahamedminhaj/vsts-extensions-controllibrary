import "../css/DateTimeControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Fabric } from "OfficeFabric/Fabric";
import { autobind } from "OfficeFabric/Utilities";

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
        return (
            <Fabric className="fabric-container">
                <DateTimePicker 
                    duration={0}
                    value={this.state.value} 
                    onChange={(newDate: Date, dateStr: string) => this.onValueChanged(newDate)} 
                    onToggle={this._onToggle} />
                    
                { this.state.error && (<InputError error={this.state.error} />) }
            </Fabric>
        )        
    }

    @autobind
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

    /*@autobind
    private _renderDatePicker(container: HTMLElement) {
        <DateTimePicker 
        $(container).datetimepicker({
            format: "dddd, MMMM Do YYYY, h:mm:ss a",
            useCurrent: false,
            showTodayButton: true,
            defaultDate: this.state.value
        });

        $(container).on("dp.change", (e: any) => {
            this.onValueChanged(e.date.toDate());
        });

        $(container).on("dp.show", function (e) {
            
        });

        $(container).on("dp.hide", function (e) {
            
        });
    }*/
}

export async function init() {
    MomentLocalizer(Moment);
    let inputs = BaseFieldControl.getInputs<IDateTimeControlInputs>();

    ReactDOM.render(
        <DateTimeControl 
            fieldName={inputs.FieldName}
        />, $("#ext-container")[0]);
}