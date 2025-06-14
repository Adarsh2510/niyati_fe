// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dzkbtgeku',
  baseUrl: 'https://res.cloudinary.com/dzkbtgeku',
  folders: {
    feAssets: 'niyati-fe-assests',
    interviewRoom: 'interview-room',
    models: 'models',
    animations: 'animations',
  },
} as const;

export const getCloudinaryImageUrl = (
  publicId: string,
  folder: keyof typeof CLOUDINARY_CONFIG.folders
): string => {
  return `${CLOUDINARY_CONFIG.baseUrl}/image/upload/f_auto,q_auto/${CLOUDINARY_CONFIG.folders[folder]}/${publicId}`;
};

export const getCloudinaryModelUrl = (
  publicId: string,
  folder: keyof typeof CLOUDINARY_CONFIG.folders,
  version: string,
  isRaw: boolean = false
): string => {
  return `${CLOUDINARY_CONFIG.baseUrl}/${isRaw ? 'raw' : 'image'}/upload/v${version}/${CLOUDINARY_CONFIG.folders[folder]}/${publicId}`;
};

// Frontend Assets
export const FE_ASSETS = {
  LANDING_PAGE: {
    BANNER_IMAGE: getCloudinaryImageUrl('dkr1lfmaivoa7tlwwvog', 'feAssets'),
  },
  DASHBOARD: {
    INTERVIEW_ROOM_BACKGROUND_IMAGE: getCloudinaryImageUrl('juexuetlcq2obci8r1mb', 'feAssets'),
  },
  MISC: {
    INTERVIEWER_AVATAR: getCloudinaryModelUrl(
      'u6x2dxyes3ujg6n63yjf.glb',
      'models',
      '1749904553',
      false
    ),
    MEETING_ANIMATION: getCloudinaryModelUrl(
      't9j61zkdbmhc5x3o2cgb.fbx',
      'animations',
      '1749904558',
      true
    ),
    SITTING_IDLE_ANIMATION: getCloudinaryModelUrl(
      'lrmooggewndxiscrqzhw.fbx',
      'animations',
      '1749904556',
      true
    ),
    TALKING_ANIMATION: getCloudinaryModelUrl(
      'ixveuvonwbvsy2xggy40.fbx',
      'animations',
      '1749904556',
      true
    ),
  },
} as const;
