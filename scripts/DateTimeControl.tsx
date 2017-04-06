import "../css/DateTimeControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Fabric } from "OfficeFabric/Fabric";
import { autobind } from "OfficeFabric/Utilities";

import {BaseFieldControl, IBaseFieldControlProps, IBaseFieldControlState} from "./BaseFieldControl";
import {InputError} from "./InputError";

interface IDateTimeControlInputs {
    FieldName: string;
}

export class DateTimeControl extends BaseFieldControl<IBaseFieldControlProps, IBaseFieldControlState> {

    public render(): JSX.Element {
        let className = "rating-control";

        return (
            <Fabric className="fabric-container">
                <div>
                    <div ref={this._renderDatePicker}/>
                </div>
                    
                { this.state.error && (<InputError error={this.state.error} />) }
            </Fabric>
        )        
    }

    @autobind
    private _renderDatePicker(container: HTMLElement) {
        $(container).datetimepicker({
            format: "dddd, MMMM Do YYYY, h:mm:ss a",
            useCurrent: false,
            sideBySide: true,
            showTodayButton: true,
            inline: true,
            defaultDate: this.state.value
        });

        $(container).on("dp.change", function (e) {
            //e.date
        });

        $(container).on("dp.show", function (e) {
            
        });

        $(container).on("dp.hide", function (e) {
            
        });
    }
}

export async function init() {
    let inputs = BaseFieldControl.getInputs<IDateTimeControlInputs>();

    ReactDOM.render(
        <DateTimeControl 
            fieldName={inputs.FieldName}
        />, $("#ext-container")[0]);
}