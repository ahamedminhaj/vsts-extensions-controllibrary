import Service = require("VSS/Service");

export class ExtensionDataManager {
    /**
    * Read user/account scoped rules for given project and work item type
    */
    public static async readDocuments<T>(key: string, isPrivate?: boolean): Promise<T[]> {       
        let dataService: IExtensionDataService = await VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
        let data: T[];

        try {            
            data = await dataService.getDocuments(key, isPrivate ? { scopeType: "User" } : undefined);
        }
        catch (e) {
            data = [];
        }

        return data;
    }

    /**
    * Read a specific user/account scoped rule
    */
    public static async readDocument<T>(key: string, id: string, isPrivate?: boolean): Promise<T> {
        let dataService: IExtensionDataService = await VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
        let data: T;
        try {            
            data = await dataService.getDocument(key, id, isPrivate ? { scopeType: "User" } : undefined);
        }
        catch (e) {
            data = null;
        }

        return data;
    }

    /**
    * Write user/account scoped rule
    */
    public static async writeDocument<T>(key: string, data: T, isPrivate?: boolean): Promise<T> {
        let dataService: IExtensionDataService = await VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
        return await dataService.setDocument(key, data, isPrivate ? { scopeType: "User" } : undefined);
    }

    /**
    * Delete user/account scoped rule
    */
    public static async deleteDocument<T>(key: string, id: string, isPrivate?: boolean): Promise<void> {
        let dataService: IExtensionDataService = await VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
        return await dataService.deleteDocument(key, id, isPrivate ? { scopeType: "User" } : undefined);
    }

    /**
    * Read user extension data for a particular work item type
    * @param workItemType
    */
    public static async readUserSetting<T>(key: string, isPrivate?: boolean): Promise<T> {
        const dataService = await VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
        try {
            const data = await dataService.getValue<T>(key, isPrivate ? { scopeType: "User" } : undefined);
            return data || {} as T;
        }
        catch (e) {
            return null;
        }
    }

    /**
    * Write user extension data for a particular work item type
    */
    public static async writeUserSetting<T>(key: string, data: T, isPrivate?: boolean): Promise<T> {
        const dataService = await VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
        try {
            return await dataService.setValue<T>(key, data, isPrivate ? { scopeType: "User" } : undefined);
        }
        catch (e) {
            return null;
        }
    }
}