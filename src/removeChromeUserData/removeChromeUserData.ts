// import { Logger } from "../googleAppsScript/Logger";
// import { AdminDirectory } from "../googleAppsScript/AdminDirectory";
import { ChromeOsDevice } from "../googleAppsScript/ChromeOsDevice";

/**
 * @type {number} - An integer defining the threshold of percentage of storage space 
 */
const STORAGE_THRESHOLD: number = 80;

/**
 * @type {number} - An integer defining the maximum command to issue during one routine.
 */
const MAX_COMMANDS: number = 50;

type DeviceStorage = {
  deviceId: string;
  serialNumber: string;
  orgUnitPath: string;
  isAboveThreshold: boolean;
}

/**
 * Calculates the percentage of used disk space.
 * 
 * @param {number} diskUsed - An integer value of used disk space. 
 * @param {number} diskTotal - An integer value of total disk space. 
 * @returns {number} - The percentage of free disk space.
 */
const calcDiskUsed = (diskUsed: number, diskTotal: number): number => Math.round(((1 - (diskUsed / diskTotal)) * 100));

/**
 * Iterates through each volume's report to determine if any partition is above the defined threshold.
 * 
 * @param {ChromeOsDevice} device - A ChromeOsDevice object to analyze.
 * @param {number} storageThreshold - An integer percentage marking the threshold. 
 * @returns {boolean} - A boolean determining whether the device is above the threshold. 
 */
const isAboveThreshold = (device: ChromeOsDevice, storageThreshold: number) => {
  let isAboveThreshold = false;
  if (!device.diskVolumeReports) { return false; }

  device.diskVolumeReports.forEach((rpt) => {
    rpt.volumeInfo.forEach(
      ({ storageFree, storageTotal } : { storageFree: string, storageTotal: string }) : void => {
        const used = calcDiskUsed(Number(storageFree), Number(storageTotal));
        isAboveThreshold = (used >= storageThreshold) ? true : isAboveThreshold;
      }
    );
  });
  return isAboveThreshold;
}

/**
 * Transforms a ChromeOsDevice Object into a DeviceStorage object
 * 
 * @param {ChromeOsDevice} device - A ChromeOsDevice object to transform into a DeviceStorage object.
 * @returns {DeviceStorage} - A DeviceStorage object from the ChromeOsDevice object. 
 */
const formatDeviceInfo = (device: ChromeOsDevice): DeviceStorage => ({
  deviceId: device.deviceId,
  serialNumber: device.serialNumber,
  orgUnitPath: device.orgUnitPath,
  isAboveThreshold: isAboveThreshold(device, STORAGE_THRESHOLD),
});

/**
 * Gets ChromeOsDevices from AdminDirectory API 
 * 
 * @param {string=} orgUnitPath - A string defining the Organizational Unit from which to list ChromeOs devices.
 * @param {boolean=} includeChildOrgunits - A boolean defining whether or not to include child Organizational Units.
 * @returns {ChromeOsDevice[]} - An array of ChromeOsDevices
 */
const getChromeDevices = ({ orgUnitPath, includeChildOrgunits } : { orgUnitPath?: string, includeChildOrgunits?: boolean }) : ChromeOsDevice[] => {
  const devices: ChromeOsDevice[] = [];
  let pageToken: string|undefined = undefined;

  do {
    Logger.log(`Getting more devices. Already collected: ${devices.length}`);
    const parameters: { pageToken: string|undefined, maxResults: number, orgUnitPath?: string, includeChildOrgunits?: boolean } = {
      pageToken,
      maxResults: 100,
    };
    if (orgUnitPath) { parameters.orgUnitPath = orgUnitPath; }
    if (includeChildOrgunits) { parameters.includeChildOrgunits = includeChildOrgunits; }

    const response = AdminDirectory.Chromeosdevices.list('my_customer', parameters);
    devices.push(...response.chromeosdevices);

    pageToken = response.nextPageToken;
  } while (pageToken);

  return devices;
}

/**
 * Gets ChromeOsDevices from AdminDirectory API based on OrgUnitPath
 * 
 * @param {string} orgUnitPath - A string defining the Organizational Unit from which to list ChromeOs devices.
 * @param {boolean} includeChildOrgunits - A boolean defining whether or not to include child Organizational Units.
 * @returns {Array<ChromeOsDevice>} - An array of ChromeOsDevices from the defined Organizational Unit(s).
 */
const getChromeDevicesByOrg = (orgUnitPath: string, includeChildOrgunits: boolean): ChromeOsDevice[] => {
  return getChromeDevices({ orgUnitPath, includeChildOrgunits });
}

/**
 * Issues a command to remove user profiles from the defined ChromeOsDevices
 * 
 * @param {string} deviceId - A string defining the Organizational Unit from which to list ChromeOs devices.
 * @returns {void}
 */
const removeUserData = (deviceId: string): void => {
  // const resource = {
  //   commandType: "WIPE_USERS",
  // };
  // AdminDirectory.Customer.Devices.Chromeos.issueCommand(resource, 'my_customer', deviceId);
  Logger.log(`Removing users on: ${deviceId}`);
}

/**
 * Main function performing the routine scan and remove operation.
 */
const main = () => {
  
  /** @todo get all OUs from AdminDirectory API, then iterate through each OU */
  const deviceList = getChromeDevicesByOrg('Devices/Moss/Student', true)
    .map((chromeDevice: ChromeOsDevice) : DeviceStorage => formatDeviceInfo(chromeDevice));
  Logger.log(deviceList.length);

  const removeUsersQueue = deviceList.filter((dev, index) => dev.isAboveThreshold)
    .filter((device, i) => (i <= MAX_COMMANDS));
  Logger.log(removeUsersQueue.length);

  removeUsersQueue.forEach(({ deviceId }) => removeUserData(deviceId));
}
