import Question from "../models/Question.js";
import Result from "../models/Result.js";


// Get Interview Questions
export const getQuestions = async (req, res) => {

  try {

    const { category, difficulty } = req.query;

    const filter = {};


    if (category && category !== "Mixed (AI Random)") {
      filter.category = category;
    }


    if (difficulty && difficulty !== "Mixed") {
      filter.difficulty = difficulty;
    }


    const questions = await Question.aggregate([
      {
        $match: filter
      },
      {
        $sample: {
          size: 5
        }
      }
    ]);


    res.json(questions);


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};





// Save Interview Result
export const saveResult = async (req, res) => {

  try {

    const result = new Result({

      userId: req.user.id,

      category: req.body.category || "General",

      answers: req.body.answers || [],

      overallScore: req.body.score || 0

    });


    await result.save();


    res.json({

      message: "Result Saved"

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};





// AI Interview Evaluation
export const evaluateInterview = async (req, res) => {

  try {

    const { question, answer } = req.body;


    if (!question || !answer) {

      return res.status(400).json({

        message: "Question and answer required"

      });

    }



    // Temporary AI Evaluation
    // Gemini quota issue ki wajah se mock response

    const evaluation = {

      score: 8,

      technicalAccuracy: 8,

      communication: 7,

      confidence: 8,

      strengths: [

        "Good explanation",

        "Concepts are clear"

      ],

      weaknesses: [

        "More real-world examples can be added"

      ],

      improvementTips: [

        "Explain with practical scenarios"

      ]

    };





    // Save AI Evaluation Result

    await Result.create({

      userId: req.user?.id || "testing-user",

      category: "General",

      answers: [

        {

          question,

          answer,

          score: evaluation.score,

          technicalAccuracy: evaluation.technicalAccuracy,

          communication: evaluation.communication,

          confidence: evaluation.confidence,

          strengths: evaluation.strengths,

          weaknesses: evaluation.weaknesses,

          improvementTips: evaluation.improvementTips

        }

      ],

      overallScore: evaluation.score

    });




    res.json(evaluation);



  } catch (error) {


    console.log(

      "Evaluation Error:",

      error.message

    );


    res.status(500).json({

      message: error.message

    });


  }

};






// Dashboard Results
export const getDashboard = async (req, res) => {

  try {


    const results = await Result.find({

      userId: req.user.id

    });


    res.json(results);



  } catch (error) {


    res.status(500).json({

      message: error.message

    });


  }

};