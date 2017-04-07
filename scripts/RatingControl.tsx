import "../css/RatingControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Fabric } from "OfficeFabric/Fabric";
import { Rating } from 'OfficeFabric/components/Rating';
import { RatingSize } from 'OfficeFabric/components/Rating/Rating.Props';

import {BaseFieldControl, IBaseFieldControlProps, IBaseFieldControlState} from "./BaseFieldControl";
import {InputError} from "./InputError";

interface IRatingControlInputs {
    FieldName: string;
    MinValue: string;
    MaxValue: string;
}

interface IRatingControlProps extends IBaseFieldControlProps {
    minValue: number;
    maxValue: number;
}

export class RatingControl extends BaseFieldControl<IRatingControlProps, IBaseFieldControlState> {

    public render(): JSX.Element {
        let className = "rating-control";

        return (
            <Fabric className="fabric-container">
                <Rating 
                    className={className} 
                    rating={this.state.value}
                    min={this.props.minValue}
                    max={this.props.maxValue}
                    size={RatingSize.Large}
                    onChanged={(newValue: number) => this.onValueChanged(newValue)} />
                    
                { this.state.error && (<InputError error={this.state.error} />) }
            </Fabric>
        )        
    }
}

export async function init() {
    let inputs = BaseFieldControl.getInputs<IRatingControlInputs>();

    ReactDOM.render(
        <RatingControl 
            fieldName={inputs.FieldName} 
            minValue={parseInt(inputs.MinValue)}
            maxValue={parseInt(inputs.MaxValue)}
        />, $("#ext-container")[0]);
}