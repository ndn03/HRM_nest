import { Injectable } from '@nestjs/common';
import { convertToSlug } from '@src/common/utils/string.utils';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  constructor() {}

  /**
   * Generates a unique suffix combining a portion of a UUID and the current timestamp.
   * This ensures a high level of uniqueness.
   * @returns A string in the format "XXXXXXXX-TIMESTAMP".
   */
  uniqueSuffix() {
    // Take the first 8 characters of a UUID and append the current timestamp.
    return `${uuidv4().slice(0, 8)}-${Date.now()}`;
  }

  /**
   * Generate a unique file name based on the original file name, ensuring it is URL-friendly
   * and unlikely to collide with other files.
   * @param file - The file object received from Multer containing the original file name.
   * @returns A string representing the unique file name in lowercase.
   */
  uniqueFileName(file: Express.Multer.File) {
    // Validate that the file object contains a valid original name.
    if (!file?.originalname) {
      throw new Error('Invalid file: originalname is required.');
    }

    // Parse the original file name into components: name (without extension) and ext (file extension).
    const { name, ext } = path.parse(file.originalname);

    // Convert the file name to a URL-friendly slug format.
    const slugName = convertToSlug(name);

    // Combine the slug name, unique suffix, and file extension, converting the entire name to lowercase.
    return `${slugName}-${this.uniqueSuffix()}${ext}`.toLowerCase();
  }
}
