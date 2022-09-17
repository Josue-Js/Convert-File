import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import axios from 'axios';
import formidable from 'formidable';

import { cloudConvert } from '../../services/cloudConvert';



export const config = {
  api: {
    bodyParser: false
  }
}

type types = {
  operation: 'convert',
  input_format: string,
  output_format: string,
  engine: string,
  credits: number,
  meta: {
    group: 'string'
  }
}

type listConversionType = {
  data: types[]
}


export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {

  if (request.method === "GET") {
    return response.status(405).json({
      message: 'method not allowed'
    })
  }

  const form = formidable({ maxFileSize: 1024 * 1024 * 10 });
  form.parse(request, async (err, fields, files) => {

    if (err) {
      if (err.code === 1009) {
        return response.status(400).json({
          message: 'max file size 10mb'
        });
      }
      return response.status(500).json({
        message: 'unable to convert file try again'
      });
    }

    const output_format = fields.output_format as string;
    const file = files.file as formidable.File;


    if (!file || !output_format) {
      return response.status(400).json({
        message: 'parameters is missing'
      });
    }

    const filename = file.originalFilename as string;

    const reg = /[\w]{3,4}$/gi;
    const fileFormat = reg.exec(filename);


    const listSupportedFormats: listConversionType = await (await axios.get(`https://api.cloudconvert.com/v2/convert/formats?filter[input_format]=${fileFormat}`)).data;


    const outputFormatIsSupported = listSupportedFormats.data.filter(format => format.output_format === output_format)[0]



    if (!outputFormatIsSupported) {
      return response.status(400).json({
        message: 'invalid conversion type'
      })
    }


    try {
      var job = await cloudConvert.jobs.create({
        tasks: {
          'upload-my-file': {
            operation: 'import/upload',
          },
          'convert-my-file': {
            operation: 'convert',
            input: 'upload-my-file',
            output_format: output_format,
          },
          'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file'
          }
        }
      });

      const uploadTask = job.tasks.filter(task => task.name === 'upload-my-file')[0];
      const inputFile = fs.createReadStream(file.filepath);
      await cloudConvert.tasks.upload(uploadTask, inputFile, filename);

      job = await cloudConvert.jobs.wait(job.id);

      const exportMyFileTask = job.tasks.filter(task => task.name === "export-my-file")[0];

      return response.status(200).json(exportMyFileTask);

    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: 'unable to convert file try'
      })
    }
  });
}