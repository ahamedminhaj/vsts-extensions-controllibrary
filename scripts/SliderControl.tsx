import "../css/SliderControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Fabric } from "OfficeFabric/Fabric";
import { Slider } from 'OfficeFabric/components/Slider';

import {BaseFieldControl, IBaseFieldControlProps, IBaseFieldControlState} from "./BaseFieldControl";
import {InputError} from "./InputError";

interface ISliderControlInputs {
    FieldName: string;
    MinValue: string;
    MaxValue: string;
    StepSize: string;
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
                <div className="slider-container">
                    <Slider 
                        className={className} 
                        value={this.state.value}
                        min={this.props.minValue}
                        max={this.props.maxValue}
                        step={this.props.stepSize}
                        showValue={false}
                        onChange={(newValue: number) => this.onValueChanged(parseFloat(newValue.toPrecision(10)))} />

                    <span className="slider-value" title={this.state.value || 0}>{this.state.value || 0}</span>
                </div>                

                { this.state.error && (<InputError error={this.state.error} />) }
            </Fabric>
        )        
    }
}

export function init() {
    let inputs = BaseFieldControl.getInputs<ISliderControlInputs>();
    
    ReactDOM.render(
        <SliderControl 
            fieldName={inputs.FieldName} 
            minValue={parseFloat(inputs.MinValue)}
            maxValue={parseFloat(inputs.MaxValue)}
            stepSize={parseFloat(inputs.StepSize)}
        />, $("#ext-container")[0]);
}