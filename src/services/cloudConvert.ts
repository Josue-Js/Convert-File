import CloudConvert from 'cloudconvert';

export const cloudConvert = new CloudConvert(process.env.API_KEY as string);