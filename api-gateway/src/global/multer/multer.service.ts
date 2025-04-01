// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import {
//   MulterModuleOptions,
//   MulterOptionsFactory,
// } from "@nestjs/platform-express";
// import * as multer from "multer";
// import { extname } from "path";

// @Injectable()
// export class MulterConfigService implements MulterOptionsFactory {
//   constructor(private readonly configService: ConfigService) {}

//   createMulterOptions(): MulterModuleOptions {
//     return {
//       storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//           console.log("Multer received file:", file);
//           cb(null, this.configService.get<string>("UPLOAD_PATH") || "./uploads");
//         },
//         filename: (req, file, cb) => {
//           const fileExt = extname(file.originalname);
//           const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
//           cb(null, uniqueName);
//         },
//       }),
//       limits: {
//         fileSize: this.configService.get<number>("upload.maxFileSize"),
//       },
//       fileFilter: (req, file, cb) => {
//         const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
//         if (allowedMimeTypes.includes(file.mimetype)) {
//           cb(null, true);
//         } else {
//           cb(new Error("Invalid file type"), false);
//         }
//       },
//     };
//   }
// }
