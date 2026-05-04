import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { generatePDF } from 'react-native-html-to-pdf';
import { showSuccessToast } from './appToast';

function stripFileScheme(path: string): string {
  return path.replace(/^file:\/\//, '');
}

export type DevicePdfSuccessCopy = {
  title: string;
  detailAndroid: string;
  detailIos: string;
};

/**
 * Renders HTML with react-native-html-to-pdf, then saves like other MD Telemed PDFs
 * (MediaStore Downloads on Android, Documents on iOS + toast).
 */
export async function saveHtmlAsDevicePdf(
  html: string,
  fileNameBase: string,
  pdfDisplayName: string,
  messages: DevicePdfSuccessCopy,
): Promise<string> {
  const result = await generatePDF({
    html,
    fileName: fileNameBase,
    directory: Platform.OS === 'ios' ? 'Documents' : 'Download',
    width: 612,
    height: 792,
    padding: 12,
    bgColor: '#FFFFFF',
  });

  const sourcePath = stripFileScheme(result.filePath);

  if (Platform.OS === 'android') {
    await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name: pdfDisplayName,
        parentFolder: 'MDTelemed',
        mimeType: 'application/pdf',
      },
      'Download',
      sourcePath,
    );
    await ReactNativeBlobUtil.fs.unlink(sourcePath).catch(() => {});
    showSuccessToast(messages.title, messages.detailAndroid);
    return sourcePath;
  }

  showSuccessToast(messages.title, messages.detailIos);
  return sourcePath;
}
