import * as React from "react";
import * as ReactDOM from "react-dom";

import * as VSSService from "VSS/Service";
import * as WitService from "TFS/WorkItemTracking/Services";
import * as VSSUtilsCore from "VSS/Utils/Core";
import * as WitExtensionContracts  from "TFS/WorkItemTracking/ExtensionContracts";
import { WorkItemFormService, IWorkItemFormService } from "TFS/WorkItemTracking/Services";

export interface IBaseFieldControlProps {
    fieldName: string;
}

export interface IBaseFieldControlState {
    error?: string;
    value?: any;
}

export class BaseFieldControl<TP extends IBaseFieldControlProps, TS extends IBaseFieldControlState> extends React.Component<TP, TS> {
    public static getInputs<T>() {
        return VSS.getConfiguration().witInputs as T;
    }

    private _flushing: boolean;
    private _bodyElement: HTMLBodyElement;
    private _windowWidth: number;
    private _minWindowWidthDelta: number = 10; // Minum change in window width to react to
    private _windowResizeThrottleDelegate: Function;
    
    constructor(props: TP, context?: any) {
        super(props, context);

        VSS.register(VSS.getContribution().id, {
            onLoaded: (args: WitExtensionContracts.IWorkItemLoadedArgs) => {
                this._invalidate();
            },
            onUnloaded: (args: WitExtensionContracts.IWorkItemChangedArgs) => {
                this._setValue(null);
            },
            onFieldChanged: (args: WitExtensionContracts.IWorkItemFieldChangedArgs) => {
                if (args.changedFields[this.props.fieldName] != null) {
                    this._invalidate();
                }   
            },
        } as WitExtensionContracts.IWorkItemNotificationListener);    

        this._windowResizeThrottleDelegate = VSSUtilsCore.throttledDelegate(this, 50, () => {
            this._windowWidth = window.innerWidth;
            this.resize();
        });

        this._windowWidth = window.innerWidth;
        $(window).resize(() => {
            if(Math.abs(this._windowWidth - window.innerWidth) > this._minWindowWidthDelta) {
               this._windowResizeThrottleDelegate.call(this);
            }
        });      

        this.initializeState(props);
    }

    public render(): JSX.Element {
        return null;
    }

    public componentDidMount() {
        this.resize();
    }

    public componentDidUpdate() {
        this.resize();
    }

    protected initializeState(props: TP) {
        this.state = {} as TS;
    }

    /**
     * Flushes the control's value to the field
     */
    protected async onValueChanged(newValue: any): Promise<void> {
        this._setValue(newValue);

        this._flushing = true;
        let workItemFormService = await WitService.WorkItemFormService.getService();
        try {
            await workItemFormService.setFieldValue(this.props.fieldName, newValue);
            this._flushing = false;
        }
        catch (e) {
            this._flushing = false;
            this._onError(`Error in storing the field value: ${e.message}`);
        }
    }    

    protected getErrorMessage(value: string): string {
        return "";
    }

    protected resize() {
        this._bodyElement = document.getElementsByTagName("body").item(0) as HTMLBodyElement;

        // Cast as any until declarations are updated
        (VSS as any).resize(null, this._bodyElement.offsetHeight);  
    }

    /**
     * Invalidate the control's value
     */
    private async _invalidate(): Promise<void> {
        if (!this._flushing) {
            let value = await this._getCurrentFieldValue();
            this._setValue(value);
        }

        this.resize();
    }    

    private async _getCurrentFieldValue(): Promise<Object> {
        let workItemFormService = await WitService.WorkItemFormService.getService();
        try {
            return await workItemFormService.getFieldValue(this.props.fieldName);
        }
        catch(e) {
            this._onError(`Error in loading the field value: ${e.message}`);
            return null;
        }
    }

    private _setValue(value: any) {
        this.setState({...this.state as any, value: value, error: this.getErrorMessage(value)});
    }    

    private _onError(error: string) {
        this.setState({...this.state as any, error: error});
    }
}