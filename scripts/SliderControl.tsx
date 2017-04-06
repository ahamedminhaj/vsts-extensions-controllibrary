import "../css/SliderControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Fabric } from "OfficeFabric/Fabric";
import { Slider } from 'OfficeFabric/components/Slider';
import { autobind } from "OfficeFabric/Utilities";

import {BaseFieldControl, IBaseFieldControlProps, IBaseFieldControlState} from "./BaseFieldControl";
import {InputError} from "./InputError";

interface ISliderControlInputs {
    FieldName: string;
    MinValue: number;
    MaxValue: number;
    StepSize: number;
}

interface ISliderControlProps extends IBaseFieldControlProps {
    minValue: number;
    maxValue: number;
    stepSize: number;
}

export class SliderControl extends BaseFieldControl<ISliderControlProps, IBaseFieldControlState> {

    public render(): JSX.Element {
        let className = "slider-control";

        return (
            <Fabric className="fabric-container">
                <Slider 
                    className={className} 
                    value={this.state.value}
                    min={this.props.minValue}
                    max={this.props.maxValue}
                    step={this.props.stepSize}
                    showValue={true}
                    onChange={(newValue: number) => this.onValueChanged(newValue)} />

                { this.state.error && (<InputError error={this.state.error} />) }
            </Fabric>
        )        
    }
}

export async function init() {
    let inputs = BaseFieldControl.getInputs<ISliderControlInputs>();
    
    ReactDOM.render(
        <SliderControl 
            fieldName={inputs.FieldName} 
            minValue={inputs.MinValue}
            maxValue={inputs.MaxValue}
            stepSize={inputs.StepSize}
        />, $("#ext-container")[0]);
}