export class AdminDirectory {
  Chromeosdevices: {
    list (
      customerId: string, parameters: {
        maxResults?: number;
        orderBy?: enum;
        orgUnitPath?: string;
        pageToken?: string;
        projection?: enum;
        query?: string;
        sortOrder?: enum;
        includeChildOrgunits?: boolean;
      },
    )
  }
}