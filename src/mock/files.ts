import { faker } from '@faker-js/faker';

export type DriveOwner = {
  displayName: string;
  emailAddress: string;
};

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  kind: 'drive#file';
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  iconLink: string;
  owners: DriveOwner[];
};

export type DriveFilesResponse = {
  kind: 'drive#fileList';
  files: DriveFile[];
};

export const generateMockDriveFiles = (count = 10): DriveFilesResponse => ({
  kind: 'drive#fileList',
  files: Array.from({ length: count }).map(() => {
    const id = faker.string.alphanumeric(12);
    type Ext = 'pdf' | 'png' | 'jpg' | 'txt' | 'xlsx';
    const ext: Ext = faker.helpers.arrayElement<Ext>(['pdf', 'png', 'jpg', 'txt', 'xlsx']);
    const mimeMap: Record<Ext, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      txt: 'text/plain',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const mimeType = mimeMap[ext];

    return {
      id,
      name: `${faker.commerce.productName()}.${ext}`,
      mimeType,
      kind: 'drive#file',
      createdTime: faker.date.past().toISOString(),
      modifiedTime: faker.date.recent().toISOString(),
      webViewLink: `https://drive.google.com/file/d/${id}/view`,
      iconLink: `https://drive-thirdparty.googleusercontent.com/16/type/${mimeType}`,
      owners: [
        {
          displayName: faker.person.fullName(),
          emailAddress: faker.internet.email(),
        },
      ],
    };
  }),
});
