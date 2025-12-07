import { IUser } from "../../models/User";
import type { File as MulterFile } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      files?: MulterFile[];
      file?: MulterFile;
    }
  }
}
