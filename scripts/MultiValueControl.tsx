import "../css/MultiValueControl.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Fabric } from "OfficeFabric/Fabric";
import { TagPicker, ITag } from 'OfficeFabric/components/pickers/TagPicker/TagPicker';
import { autobind } from "OfficeFabric/Utilities";

import Utils_String = require("VSS/Utils/String");
import Utils_Array = require("VSS/Utils/Array");
import { WorkItemFormService, IWorkItemFormService } from "TFS/WorkItemTracking/Services";
import * as WitService from "TFS/WorkItemTracking/Services";

import {BaseFieldControl, IBaseFieldControlProps, IBaseFieldControlState} from "./BaseFieldControl";
import {InputError} from "./InputError";

interface IMultiValueControlInputs {
    FieldName: string;
    Values: string;
}

interface IMultiValueControlProps extends IBaseFieldControlProps {
    suggestedValues: string[];
}

export class MultiValueControl extends BaseFieldControl<IMultiValueControlProps, IBaseFieldControlState> {
    public render(): JSX.Element {
        let tagPickerClassName = "multi-value-picker";
        if (this.state.error) {
            tagPickerClassName += " invalid-value";
        }
          
        let defaultValues = this._parseFieldValue();
        return (
            <Fabric className="fabric-container">
                <TagPicker className={tagPickerClassName}
                    defaultSelectedItems={defaultValues}
                    onResolveSuggestions={this._onFilterChange}
                    getTextFromItem={item => item.name}
                    onChange={items => this.onValueChanged(items.map(item => item.key).join(";"))}
                    pickerSuggestionsProps={
                        {
                            suggestionsHeaderText: 'Suggested values',
                            noResultsFoundText: 'No values Found'
                        }
                    }
                />
                { this.state.error && (<InputError error={this.state.error} />) }
            </Fabric>
        )        
    }

    @autobind
    private _onFilterChange(filterText: string, tagList: ITag[]): ITag[] {
        return filterText
            ? this.props.suggestedValues.filter(value => value.toLowerCase().indexOf(filterText.toLowerCase()) === 0 
                && Utils_Array.findIndex(tagList, (tag: ITag) => Utils_String.equals(tag.key, value, true)) === -1).map(value => {
                    return { key: value, name: value};
                }) 
            : [];
    }

    @autobind
    private _parseFieldValue(): ITag[] {
        let value = this.state.value as string;
        if (value) {
            return value.split(";").map(v => {
                return { key: v.trim(), name: v.trim()};
            });
        }
        else {
            return [];
        }
    }
}

export async function init() {
    let inputs = BaseFieldControl.getInputs<IMultiValueControlInputs>();
    
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