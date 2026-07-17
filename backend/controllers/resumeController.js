// Upload Resume Controller

export const uploadResume = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message: "No resume uploaded",

      });

    }


    res.status(200).json({

      success: true,

      message: "Resume uploaded successfully",

      file: {

        filename: req.file.filename,

        originalname: req.file.originalname,

        size: req.file.size,

        path: req.file.path,

      },

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};