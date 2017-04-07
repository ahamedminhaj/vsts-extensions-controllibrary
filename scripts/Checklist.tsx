import "../css/Checklist.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Fabric } from "OfficeFabric/Fabric";
import { Checkbox } from 'OfficeFabric/Checkbox';
import { IconButton } from "OfficeFabric/components/Button";
import { TextField } from "OfficeFabric/TextField";
import { autobind } from "OfficeFabric/Utilities";
import {Icon} from "OfficeFabric/Icon";
import {Pivot, PivotItem} from "OfficeFabric/Pivot";

import * as WitExtensionContracts  from "TFS/WorkItemTracking/ExtensionContracts";
import { WorkItemFormService, IWorkItemFormService } from "TFS/WorkItemTracking/Services";
import * as Utils_Array from "VSS/Utils/Array";
import * as Utils_String from "VSS/Utils/String";

import {AutoResizableComponent} from "./AutoResizableComponent";
import {ExtensionDataManager} from "./ExtensionDataManager";
import {Loading} from "./Loading";
import {MessagePanelComponent, MessageType} from "./MessagePanel";
import {InputError} from "./InputError";

interface IChecklistProps {
}

interface IChecklistState {
    privateDataModel: IExtensionDataModel;
    sharedDataModel: IExtensionDataModel;
    isLoaded: boolean;
    isNewWorkItem: boolean;
    itemText: string;
    error: string;
    isPersonalView: boolean;
}

interface IChecklistItem {
    id: string;
    text: string;
    checked: boolean;
}

interface IExtensionDataModel {
    id: string;
    __etag: number;
    items: IChecklistItem[];
}

export class Checklist extends AutoResizableComponent<IChecklistProps, IChecklistState> {
    constructor(props: IChecklistProps, context?: any) {
        super(props, context);

        VSS.register(VSS.getContribution().id, {
            onLoaded: (args: WitExtensionContracts.IWorkItemLoadedArgs) => {
                this._refreshItems();
            },
            onUnloaded: (args: WitExtensionContracts.IWorkItemChangedArgs) => {
                this.setState({...this.state, items: []});
            },
            onRefreshed: (args: WitExtensionContracts.IWorkItemChangedArgs) => {
                this._refreshItems();
            },
            onSaved: (args: WitExtensionContracts.IWorkItemChangedArgs) => {
                this._refreshItems();
            }
        } as WitExtensionContracts.IWorkItemNotificationListener);

        this.state = {
            privateDataModel: null,
            sharedDataModel: null,
            isLoaded: false,
            isNewWorkItem: false,
            itemText: "",
            error: "",
            isPersonalView: true
        }
    }

    public render(): JSX.Element {
        if (!this.state.isLoaded) {
            return <Loading />;
        }
        else if(this.state.isNewWorkItem) {
            return <MessagePanelComponent message={"You need to save the workitem before working with checklist"} messageType={MessageType.Info} />
        }
        else {
            let currentModel = this.state.isPersonalView ? this.state.privateDataModel : this.state.sharedDataModel;

            return (
                <Fabric className="fabric-container">
                    <div className="container">
                        <Pivot initialSelectedIndex={this.state.isPersonalView ? 0 : 1} onLinkClick={this._onPivotChange}>
                            <PivotItem linkText="Personal" itemKey="personal" />
                            <PivotItem linkText="Shared" itemKey="shared" />
                        </Pivot>
                        <div className="checklist-items">
                            { 
                                (currentModel == null || currentModel.items == null || currentModel.items.length == 0)
                                && 
                                <MessagePanelComponent message={"No checklist items yet."} messageType={MessageType.Info} />
                            }
                            { 
                                (currentModel != null && currentModel.items != null && currentModel.items.length > 0) 
                                && 
                                this._renderCheckListItems(currentModel.items)
                            }
                            
                        </div>
                        <div className="add-checklist-items">
                            <Icon className="add-icon" iconName="Add" />
                            <input
                                type="text" 
                                value={this.state.itemText}
                                onChange={this._onItemTextChange} 
                                onKeyUp={this._onEnterListItem}
                                />
                            { this.state.error && (<InputError error={this.state.error} />) }
                        </div>
                    </div>                    
                </Fabric>
            );
        }
    }

    @autobind
    private _onPivotChange(item: PivotItem) {
        this.setState({...this.state, isPersonalView: item.props.itemKey === "personal", itemText: "", error: ""});
    }

    @autobind
    private async _onEnterListItem(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13 && this.state.itemText && this.state.itemText.trim()) {
            const workItemFormService = await WorkItemFormService.getService();
            const workItemId = await workItemFormService.getId();
            let newModel: IExtensionDataModel;

            if (this.state.isPersonalView) {
                newModel = this.state.privateDataModel ? {...this.state.privateDataModel} : {id: `${workItemId}`, __etag: 0, items: []};
            }
            else {
                newModel = this.state.sharedDataModel ? {...this.state.sharedDataModel} : {id: `${workItemId}`, __etag: 0, items: []};
            }

            newModel.items = (newModel.items || []).concat({id: `${Date.now()}`, text: this.state.itemText, checked: false});

            newModel = await ExtensionDataManager.writeDocument<IExtensionDataModel>("CheckListItems", newModel, this.state.isPersonalView);

            if (this.state.isPersonalView) {
                this.setState({...this.state, itemText: "", error: "", privateDataModel: newModel});
            }
            else {
                this.setState({...this.state, itemText: "", error: "", sharedDataModel: newModel});
            }
        }        
    }

    @autobind
    private _onItemTextChange(e: React.ChangeEvent<HTMLInputElement>) {        
        this.setState({...this.state, itemText: e.target.value, error: this._getItemTextError(e.target.value)});
    }

    @autobind
    private _getItemTextError(value: string): string {
        if (value.length > 128) {
            return `The length of the title should less than 128 characters, actual is ${value.length}.`
        }
        return "";
    }

    private _renderCheckListItems(items: IChecklistItem[]): React.ReactNode {
        return items.map((item: IChecklistItem, index: number) => {
            return (
                <div className="checklist-item" key={`${index}`}>
                    <Checkbox 
                        className="checkbox"
                        label={item.text}
                        checked={item.checked}
                        onChange={(ev: React.FormEvent<HTMLElement>, isChecked: boolean) => this._onCheckboxChange(item.id, isChecked) } />         

                    <IconButton icon="Delete" title="Delete item" onClick={() => this._onDeleteItem(item.id)} />
                </div>
            );
        });
    }

    @autobind
    private async _onDeleteItem(itemId: string) {
        let currentModel = this.state.isPersonalView ? this.state.privateDataModel : this.state.sharedDataModel;

        let newModel =  {...currentModel};
        Utils_Array.removeWhere(newModel.items, (item: IChecklistItem) => Utils_String.equals(item.id, itemId, true));

        newModel = await ExtensionDataManager.writeDocument<IExtensionDataModel>("CheckListItems", newModel, this.state.isPersonalView);

        if (this.state.isPersonalView) {
            this.setState({...this.state, privateDataModel: newModel});
        }
        else {
            this.setState({...this.state, sharedDataModel: newModel});
        }
    }

    @autobind
    private async _onCheckboxChange(itemId: string, isChecked: boolean) {
        let currentModel = this.state.isPersonalView ? this.state.privateDataModel : this.state.sharedDataModel;

        let newModel =  {...currentModel};
        let index = Utils_Array.findIndex(newModel.items, (item: IChecklistItem) => Utils_String.equals(item.id, itemId, true));
        if (index !== -1) {
            newModel.items[index].checked = isChecked;
        }

        newModel = await ExtensionDataManager.writeDocument<IExtensionDataModel>("CheckListItems", newModel, this.state.isPersonalView);

        if (this.state.isPersonalView) {
            this.setState({...this.state, privateDataModel: newModel});
        }
        else {
            this.setState({...this.state, sharedDataModel: newModel});
        }
    }

    private async _refreshItems() {
        this.setState({...this.state, privateDataModel: null, sharedDataModel: null, isLoaded: false, isNewWorkItem: false});

        const workItemFormService = await WorkItemFormService.getService();
        const isNew = await workItemFormService.isNew();

        if (isNew) {
            this.setState({...this.state, privateDataModel: null, sharedDataModel: null, isLoaded: true, isNewWorkItem: true});
        }
        else {
            const workItemId = await workItemFormService.getId();
            let models: IExtensionDataModel[] = await Promise.all([
                ExtensionDataManager.readDocument<IExtensionDataModel>("CheckListItems", `${workItemId}`, true),
                ExtensionDataManager.readDocument<IExtensionDataModel>("CheckListItems", `${workItemId}`, false)
            ]);

            this.setState({...this.state, privateDataModel: models[0], sharedDataModel: models[1], isLoaded: true, isNewWorkItem: false});
        }
    }
}

export function init() {
    ReactDOM.render(<Checklist />, $("#ext-container")[0]);
}