import path from 'path';
import {
  CompleteMultipartUploadCommandOutput,
  CopyObjectCommand,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { MediaService } from '../media.service';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class MediaS3Service {
  private readonly bucketName: string;
  private s3Client: S3Client;
  constructor(private readonly mediaService: MediaService) {
    this.bucketName = process.env.AWS_S3_BUCKET;
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
      endpoint: process.env.AWS_S3_ENDPOINT,
      forcePathStyle: true,
      region: process.env.AWS_S3_REGION,
    });
  }

  /**
   *
   * Uploads a single file to S3 using PutObjectCommand.
   * @param file - The file to upload.
   * @param folder - The folder to upload the file to.
   * @returns The result of the upload.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = '',
  ): Promise<{ result: PutObjectCommandOutput; key: string }> {
    try {
      //TODO: Add validation for the file (e.g., size, type)

      const fileName = this.mediaService.uniqueFileName(file);
      const key = [folder, fileName].filter(Boolean).join('/');
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      });
      const result = await this.s3Client.send(uploadCommand);
      return {
        result,
        key,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Uploads multiple files to S3 using PutObjectCommand.
   * @param files - The list of files to upload.
   * @param folder - The folder to upload the files to.
   * @returns The result of the uploads.
   */
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string = '',
  ): Promise<{ result: PutObjectCommandOutput; key: string }[]> {
    try {
      //TODO: Add validation for the file (e.g., size, type)

      const uploadPromises = files.map(async (file) => {
        const fileName = this.mediaService.uniqueFileName(file);
        const key = [folder, fileName].filter(Boolean).join('/');
        const uploadCommand = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        });
        return this.s3Client
          .send(uploadCommand)
          .then((result) => ({ result, key }));
      });
      return Promise.all(uploadPromises);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Uploads a large file to S3 using multipart upload.
   * @param file - The file to be uploaded, received from Express Multer.
   * @param folder - The folder in S3 where the file will be stored.
   * @returns An object containing the result of the multipart upload and the S3 key for the uploaded file.
   */
  async uploadLargeFile({
    file,
    queueSize = 5,
    partSize = 50,
    folder = '',
  }: {
    file: Express.Multer.File;
    queueSize?: number;
    partSize?: number;
    folder?: string;
  }): Promise<{
    result: CompleteMultipartUploadCommandOutput;
    key: string;
  }> {
    try {
      // TODO: Add validation for the file (e.g., size, type)

      // Generate a unique file name and create the S3 key (including folder if specified)
      const fileName = this.mediaService.uniqueFileName(file);
      const key = [folder, fileName].filter(Boolean).join('/');

      // Set up the S3 upload parameters using the Upload API
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName, // S3 bucket name
          Key: key, // S3 object key (including folder path)
          Body: file.buffer, // File content (from Multer buffer)
          ACL: 'public-read', // Make the uploaded file publicly readable
          ContentType: file.mimetype, // Set content type based on the file's mimetype
        },
        queueSize, // Upload up to 5 parts concurrently
        partSize: partSize * 1024 * 1024, // Set each part's size to 50MB
      });

      // Perform the upload and await the result
      const result = await upload.done();
      return { result, key }; // Return the result and the S3 key
    } catch (error) {
      // Catch and throw any errors encountered during the upload process
      throw error;
    }
  }

  /**
   *
   * Download a file from S3.
   * @param key - The S3 key (path) for the file to be downloaded.
   * @returns A promise that resolves to the result of the download operation.
   */
  async downloadFile(key: string): Promise<GetObjectCommandOutput> {
    try {
      return this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Delete a file from S3.
   * @param key - The S3 key (path) for the file to be deleted.
   * @returns A promise that resolves to the result of the delete operation.
   */
  async deleteFile(key: string) {
    try {
      return this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Delete multiple files from S3.
   * @param keys - A list of file keys (paths) to be deleted from S3.
   * @returns The result of the file deletion operation.
   */
  async deleteFiles(keys: string[]): Promise<DeleteObjectsCommandOutput> {
    try {
      const objectsToDelete = keys.map((key) => ({ Key: key }));

      const result = await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucketName,
          Delete: { Objects: objectsToDelete, Quiet: false },
        }),
      );

      if (result.Deleted && result.Deleted.length > 0)
        Logger.debug(`Deleted ${result.Deleted.length} tệp.`);

      if (result.Errors && result.Errors.length > 0)
        Logger.debug('Files cannot be deleted:', result.Errors);

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * List all files in S3, with the option to filter by prefix (directory path).
   * @param prefix - The prefix of the objects (folder). For example, 'folder/' to list only the files within the 'folder' directory.
   * @returns The result containing information about the files.
   */
  async findAllFiles(prefix: string = ''): Promise<ListObjectsV2CommandOutput> {
    try {
      const params = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix, // Folder path, e.g., 'folder/'
        MaxKeys: 1000,
      });
      return await this.s3Client.send(params);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Delete all files within a folder in S3.
   * @param folder - The folder path to delete files from. Ensure the folder path ends with "/".
   */
  async deleteFolder(folder: string): Promise<void> {
    try {
      // Set up parameters to list objects in the specified folder.
      const listParams = {
        Bucket: this.bucketName,
        Prefix: folder.endsWith('/') ? folder : `${folder}/`, // Ensure prefix ends with "/"
      };

      // List all objects in the folder (using prefix).
      const listedObjects = await this.s3Client.send(
        new ListObjectsV2Command(listParams),
      );

      // If no objects are found, the folder is empty or doesn't exist, so return early.
      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        return;
      }

      // Set up parameters to delete the listed objects (files).
      const deleteParams = {
        Bucket: this.bucketName,
        Delete: {
          Objects: listedObjects.Contents.map((file) => ({ Key: file.Key })), // Create an array of objects to delete.
          Quiet: true, // Suppress output for deleted objects.
        },
      };

      // Delete the objects in the folder.
      await this.s3Client.send(new DeleteObjectsCommand(deleteParams));

      // If there are more files (pagination), recursively delete the remaining files.
      if (listedObjects.IsTruncated) await this.deleteFolder(folder);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Duplicates a file in S3 and stores it in a new location with a new suffix
   * to avoid filename collisions.
   * @param sourceKey - The S3 key (path) of the source file to duplicate.
   * @param folder - Optional folder to store the duplicated file.
   * @returns An object containing the result of the copy operation and the new S3 key.
   */
  async duplicateFile(
    sourceKey: string,
    folder?: string,
  ): Promise<{ result: CopyObjectCommandOutput; key: string }> {
    // Parse the source file path to extract the file name and extension
    const parse = path.parse(sourceKey);
    const filenameSource = parse.name; // The file name without extension

    // Split the original file name by '-' and remove the last part (which is the old suffix)
    // This ensures that we keep the base name of the file and prepare it for adding the new suffix
    const baseName = filenameSource.split('-').slice(0, -1).join('-');

    // Generate a new file name by appending a new unique suffix to the base name
    const fileName =
      `${baseName}-${this.mediaService.uniqueSuffix()}${parse.ext}`.toLowerCase();

    // Build the key (path) for the new file in S3, including the optional folder
    const key = [folder, fileName].filter(Boolean).join('/');

    // Prepare the copy command parameters, including the source file and destination key
    const params = new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: `${this.bucketName}/${sourceKey}`,
      Key: key,
      ACL: 'public-read',
    });

    // Execute the copy operation using the S3 client
    const result = await this.s3Client.send(params);

    // Return the result of the copy operation and the new key of the duplicated file
    return { result, key };
  }
}
