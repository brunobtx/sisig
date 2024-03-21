import crypto from 'crypto'
import multer from 'multer'

import {extname, resolve} from 'path'


export default{
    upload(folder: string){

        return{
            storage: multer.diskStorage({
                destination: resolve(__dirname, '..', '..', folder),
                filename: (request, file, callback) => {
                    const fileMath = crypto.randomBytes(16).toString("hex");
                    const fileName = `${fileMath}-${file.originalname}`;

                    return callback(null, fileName)
                }
            })
        }
    }
}