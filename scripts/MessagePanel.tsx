import "../css/MessagePanel.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import {Icon, IconName} from "OfficeFabric/Icon";
import {Label} from "OfficeFabric/Label";

import {AutoResizableComponent} from "./AutoResizableComponent";

interface IMessagePanelInputs {
    Message: string;
    MessageType: string;
}

interface IMessagePanelProps {
    message: string;
    messageType: MessageType;
}

export enum MessageType {
    Error,
    Warning,
    Info,
    Success
}

export var MessagePanelComponent: React.StatelessComponent<IMessagePanelProps> =
    (props: IMessagePanelProps): JSX.Element => {
        let className = "message-panel";
        let iconName: IconName;

        switch (props.messageType) {
            case MessageType.Error:
                iconName = "StatusErrorFull";
                className += " message-error";
                break;
            case MessageType.Warning:
                iconName = "Warning";
                className += " message-warning";
                break;
            case MessageType.Success:
                iconName = "SkypeCircleCheck";
                className += " message-success";
                break;
            default:
                iconName = "Info";
                className += " message-info";
                break;
        }

        return (
            <div className={className}>
                <Icon className="icon" iconName={iconName} />
                <Label className="message-text">{props.message}</Label>
            </div>
        );
}

export class MessagePanel extends AutoResizableComponent<IMessagePanelProps, void> {

    public render(): JSX.Element {
        return <MessagePanelComponent message={this.props.message} messageType={this.props.messageType} />;
    }
}

export function init() {
    let inputs = VSS.getConfiguration().witInputs as IMessagePanelInputs;
    let messageType: MessageType;

    if (inputs.MessageType == null || inputs.MessageType.trim() === "") {
        messageType = MessageType.Info;
    }
    else {
        switch (inputs.MessageType.toLowerCase()) {
            case "error":
                messageType = MessageType.Error;
                break;
            case "warning":
                messageType = MessageType.Warning;
                break;
            case "success":
                messageType = MessageType.Success;
                break;
            default:
                messageType = MessageType.Info;
                break;
        }
    }

    ReactDOM.render(
        <MessagePanel 
            message={inputs.Message}
            messageType={messageType}
        />, $("#ext-container")[0]);
}