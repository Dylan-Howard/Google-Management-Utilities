export type ChromeOsDevice = {
  deviceId: string;
  serialNumber: string;
  status: string;
  lastSync: string;
  supportEndDate: string;
  annotatedUser: string;
  annotatedLocation: string;
  notes: string;
  model: string;
  meid: string;
  orderNumber: string;
  willAutoRenew: boolean;
  osVersion: string;
  platformVersion: string;
  firmwareVersion: string;
  macAddress: string;
  bootMode: string;
  lastEnrollmentTime: string;
  kind: string;
  recentUsers: [
    {
      type: string;
      email: string
    }
  ];
  activeTimeRanges: [
    {
      activeTime: number;
      date: string
    }
  ];
  ethernetMacAddress: string;
  annotatedAssetId: string;
  etag: string;
  diskVolumeReports: [
    {
      volumeInfo: [
        {
          volumeId: string;
          storageTotal: string;
          storageFree: string
        }
      ]
    }
  ];
  systemRamTotal: string;
  cpuStatusReports: [
    {
      reportTime: string;
      cpuUtilizationPercentageInfo: [
        number
      ];
      cpuTemperatureInfo: [
        {
          temperature: number;
          label: string
        }
      ]
    }
  ];
  cpuInfo: [
    {
      model: string;
      architecture: string;
      maxClockSpeedKhz: number;
      logicalCpus: [
        {
          maxScalingFrequencyKhz: number;
          currentScalingFrequencyKhz: number;
          idleDuration: string;
          cStates: [
            {
              displayName: string;
              sessionDuration: string
            }
          ]
        }
      ]
    }
  ];
  deviceFiles: [
    {
      name: string;
      type: string;
      downloadUrl: string;
      createTime: string
    }
  ];
  systemRamFreeReports: [
    {
      reportTime: string;
      systemRamFreeInfo: [
        string
      ]
    }
  ];
  lastKnownNetwork: [
    {
      ipAddress: string;
      wanIpAddress: string
    }
  ];
  autoUpdateExpiration: string;
  ethernetMacAddress0: string;
  dockMacAddress: string;
  manufactureDate: string;
  orgUnitPath: string;
  tpmVersionInfo: {
    family: string;
    specLevel: string;
    manufacturer: string;
    tpmModel: string;
    firmwareVersion: string;
    vendorSpecific: string
  };
  screenshotFiles: [
    {
      name: string;
      type: string;
      downloadUrl: string;
      createTime: string
    }
  ];
  orgUnitId: string;
  osUpdateStatus: {
    object (OsUpdateStatus)
  };
  firstEnrollmentTime: string
}
